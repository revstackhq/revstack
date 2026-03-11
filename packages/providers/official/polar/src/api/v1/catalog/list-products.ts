import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  ListProductsOptions,
  Product,
  AsyncActionResult,
  PaginatedResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toProduct } from "@/api/v1/products/mapper";

/**
 * Lists products from the provider's catalog with cursor-based pagination.
 *
 * @param ctx - The provider execution context.
 * @param options - Pagination and filtering options.
 * @returns An AsyncActionResult containing a paginated list of Product entities.
 */
export async function listProducts(
  ctx: ProviderContext,
  options: ListProductsOptions,
): Promise<AsyncActionResult<PaginatedResult<Product>>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const limit = options.limit ?? 10;

    const list = await polar.products.list({
      limit,
      starting_after:
        options.cursor && options.direction !== "backward"
          ? options.cursor
          : undefined,
      ending_before:
        options.cursor && options.direction === "backward"
          ? options.cursor
          : undefined,
      active: options.filters?.active,
    });

    const data = list.data.map(toProduct);
    const lastItem = data[data.length - 1];

    return {
      data: {
        data,
        hasMore: list.has_more,
        nextCursor: list.has_more && lastItem ? lastItem.id : undefined,
      },
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
