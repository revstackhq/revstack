import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  UpdateProductInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Updates an existing product in the provider's catalog.
 *
 * @param ctx - The provider execution context.
 * @param input - The product ID and partial fields to update.
 * @returns An AsyncActionResult yielding the updated product ID.
 */
export async function updateProduct(
  ctx: ProviderContext,
  input: UpdateProductInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const { id, ...updateFields } = input;

    const product = await polar.products.update({
      id,
      name: updateFields.name,
      description: updateFields.description ?? undefined,
      metadata: updateFields.metadata as Record<string, string> | undefined,
    });

    return { data: product.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
