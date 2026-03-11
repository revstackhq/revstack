import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  ListPricesOptions,
  Price,
  AsyncActionResult,
  PaginatedResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toPrice } from "@/api/v1/prices/mapper";

/**
 * Lists prices for a given product with cursor-based pagination.
 *
 * @param ctx - The provider execution context.
 * @param options - Pagination options and the parent productId.
 * @returns An AsyncActionResult containing a paginated list of Price entities.
 */
export async function listPrices(
  ctx: ProviderContext,
  options: ListPricesOptions,
): Promise<AsyncActionResult<PaginatedResult<Price>>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const limit = options.limit ?? 10;

    const list = await polar.prices.list({
      product: options.productId,
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

    const data = list.data.map(toPrice);
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
