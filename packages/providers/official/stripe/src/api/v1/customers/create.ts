import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreateCustomerInput,
  AsyncActionResult,
  Address,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

function toStripeAddress(addr?: Address): Stripe.AddressParam | undefined {
  if (!addr) return undefined;
  return {
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postal_code: addr.postalCode,
    country: addr.country,
  };
}

/**
 * Creates a new customer record with the provider.
 * Maps the Revstack address format to the provider's native schema.
 * Injects the current trace ID into metadata for cross-service observability.
 *
 * @param ctx - The provider context containing configuration and trace info.
 * @param input - The customer profile payload (email, name, phone, address).
 * @returns An AsyncActionResult yielding the newly created customer ID.
 */
export async function createCustomer(
  ctx: ProviderContext,
  input: CreateCustomerInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.create(
      {
        email: input.email,
        name: input.name,
        phone: input.phone,
        description: input.description,
        address: toStripeAddress(input.address),
        metadata: {
          ...input.metadata,
          revstack_trace_id: ctx.traceId || null,
        },
      },
      { idempotencyKey: ctx.idempotencyKey },
    );

    return { data: customer.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
