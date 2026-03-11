import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  GetProductInput,
  Product,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toProduct } from "@/api/v1/products/mapper";

/**
 * Retrieves a product by its external ID from the provider's catalog.
 *
 * @param ctx - The provider execution context.
 * @param input - Contains the product ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Product entity.
 */
export async function getProduct(
  ctx: ProviderContext,
  input: GetProductInput,
): Promise<AsyncActionResult<Product>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const product = await polar.products.retrieve(input.id);

    return { data: toProduct(product), status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
