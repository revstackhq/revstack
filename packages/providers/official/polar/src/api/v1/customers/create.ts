import {
  AsyncActionResult,
  CreateCustomerInput,
  ProviderContext,
  normalizeCountry,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";
import { CountryAlpha2Input } from "@polar-sh/sdk/models/components/addressinput.js";

/**
 * Creates a new customer in Polar.
 *
 * @param ctx - The provider context.
 * @param input - Customer input payload.
 * @returns The created customer ID.
 */
export const createCustomer = async (
  ctx: ProviderContext,
  input: CreateCustomerInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreateClient(ctx);
    const customer = await polar.customers.create({
      email: input.email,
      name: input.name,
      metadata: input.metadata || {},
      billingAddress: input.address
        ? {
            line1: input.address.line1,
            line2: input.address.line2,
            city: input.address.city,
            state: input.address.state,
            postalCode: input.address.postalCode,
            country: normalizeCountry(
              input.address.country,
            ) as CountryAlpha2Input,
          }
        : undefined,
    });

    return {
      data: customer.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};
