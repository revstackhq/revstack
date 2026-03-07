import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  DeleteCustomerInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Permanently deletes a customer from the provider.
 * This action is destructive and cannot be undone.
 *
 * @param ctx - The provider context instance.
 * @param input - Contains the customer ID to delete.
 * @returns An AsyncActionResult yielding `true` if the deletion succeeded.
 */
export async function deleteCustomer(
  ctx: ProviderContext,
  input: DeleteCustomerInput,
): Promise<AsyncActionResult<boolean>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const deleted = await stripe.customers.del(input.id);
    return { data: deleted.deleted, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: false, status: "failed", error: error.errorPayload };
    return { data: false, status: "failed", error: mapError(error) };
  }
}
