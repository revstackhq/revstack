import { toCustomer } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  RevstackErrorCode,
  Customer,
  AsyncActionResult,
  GetCustomerInput,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Retrieves a full customer record by their provider ID.
 * If the provider returns a deleted customer stub, throws a ResourceNotFound error.
 *
 * @param ctx - The provider context instance.
 * @param input - Contains the customer ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Revstack Customer.
 */
export async function getCustomer(
  ctx: ProviderContext,
  input: GetCustomerInput,
): Promise<AsyncActionResult<Customer>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.retrieve(input.id);

    if (customer.deleted) {
      throw {
        isRevstackError: true,
        errorPayload: {
          code: RevstackErrorCode.ResourceNotFound,
          message: "Customer has been deleted",
        },
      };
    }

    return { data: toCustomer(customer), status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
