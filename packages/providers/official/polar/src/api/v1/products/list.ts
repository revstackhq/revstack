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
 * Lists products from the provider's catalog mapping offset-based pagination (page) to cursor.
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

    let page = 1;
    if (options.cursor) {
      const parsedPage = parseInt(options.cursor, 10);
      if (!isNaN(parsedPage)) {
        page = parsedPage;
      }
    }

    if (options.direction === "backward" && page > 1) {
      page -= 1;
    }

    const list = await polar.products.list({
      limit,
      page,
    });

    const rawItems = list.result.items || [];
    const pagination = list.result.pagination;

    const data = rawItems.map(toProduct);

    const hasMore = page < pagination.maxPage;
    const nextCursor = hasMore ? (page + 1).toString() : undefined;

    return {
      data: {
        data,
        hasMore,
        nextCursor,
      },
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
