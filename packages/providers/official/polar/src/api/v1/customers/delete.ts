import {
  AsyncActionResult,
  DeleteCustomerInput,
  ProviderContext,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Deletes a customer permanently from Polar.
 *
 * @param ctx - The provider context.
 * @param input - The customer ID to delete.
 * @returns A boolean indicating success.
 */
export const deleteCustomer = async (
  ctx: ProviderContext,
  input: DeleteCustomerInput,
): Promise<AsyncActionResult<boolean>> => {
  try {
    const polar = getOrCreateClient(ctx);
    await polar.customers.delete({
      id: input.id,
    });

    return {
      data: true,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: false, status: "failed", error: error.errorPayload };
    }
    return { data: false, status: "failed", error: mapError(error) };
  }
};
