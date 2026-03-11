import {
  AsyncActionResult,
  UpdateCustomerInput,
  ProviderContext,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Updates an existing Polar customer by ID.
 *
 * @param ctx - The provider context.
 * @param input - The update payload.
 * @returns The updated customer ID.
 */
export const updateCustomer = async (
  ctx: ProviderContext,
  input: UpdateCustomerInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreateClient(ctx);
    const customer = await polar.customers.update({
      id: input.id,
      customerUpdate: {
        email: input.email,
        name: input.name || undefined,
        metadata: input.metadata || {},
      },
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
