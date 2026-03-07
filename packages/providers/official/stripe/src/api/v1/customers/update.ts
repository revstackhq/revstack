import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  UpdateCustomerInput,
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
 * Updates an existing customer profile by their provider ID.
 * Replaces mapped properties including metadata without affecting
 * subscriptions or attached payment methods.
 *
 * @param ctx - The provider context instance.
 * @param input - The payload of modifications to apply.
 * @returns An AsyncActionResult yielding the updated customer ID.
 */
export async function updateCustomer(
  ctx: ProviderContext,
  input: UpdateCustomerInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.update(input.id, {
      email: input.email,
      name: input.name,
      phone: input.phone,
      description: input.description,
      address: toStripeAddress(input.address),
      metadata: input.metadata,
    });

    return { data: customer.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
