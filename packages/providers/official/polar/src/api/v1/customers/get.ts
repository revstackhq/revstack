import {
  AsyncActionResult,
  GetCustomerInput,
  Customer,
  ProviderContext,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapPolarCustomerToCustomer } from "@/api/v1/customers/mapper";
import { mapError } from "@/shared/error-map";

/**
 * Retrieves a customer profile from Polar by ID.
 *
 * @param ctx - The provider context.
 * @param input - The customer ID to fetch.
 * @returns The mapped customer object.
 */
export const getCustomer = async (
  ctx: ProviderContext,
  input: GetCustomerInput,
): Promise<AsyncActionResult<Customer>> => {
  try {
    const polar = getOrCreateClient(ctx);
    const customer = await polar.customers.get({
      id: input.id,
    });

    return {
      data: mapPolarCustomerToCustomer(customer),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};
