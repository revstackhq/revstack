import { getOrCreateClient } from "@/api/v1/client";
import { toPrice } from "@/api/v1/prices/mapper";
import { mapError } from "@/shared/error-map";
import {
  AsyncActionResult,
  ListPricesOptions,
  PaginatedResult,
  Price,
  ProviderContext,
} from "@revstackhq/providers-core";

/**
 * Lists prices from Polar.
 * Maps Polar's offset-based pagination (page) to Revstack's cursor.
 */
export async function listPrices(
  ctx: ProviderContext,
  options: ListPricesOptions,
): Promise<AsyncActionResult<PaginatedResult<Price>>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const limit = options.limit ?? 10;

    // 1. Handle Polar's page-based pagination via cursor
    let page = 1;
    if (options.cursor) {
      const parsedPage = parseInt(options.cursor, 10);
      if (!isNaN(parsedPage)) page = parsedPage;
    }

    if (options.direction === "backward" && page > 1) {
      page -= 1;
    }

    // 2. Fetch products (because that's where prices live)
    // If productId is provided in options, we fetch just that one.
    // Otherwise, we paginate through all products.
    let prices: Price[] = [];
    let hasMore = false;

    if (options.productId) {
      const product = await polar.products.get({ id: options.productId });
      prices = product.prices.map((p: any) =>
        toPrice({
          price: p,
          type: product.isRecurring ? "recurring" : "one_time",
          productId: product.id,
        }),
      );
      hasMore = false; // Single product means we have all its prices
    } else {
      const list = await polar.products.list({
        limit,
        page,
      });

      const products = list.result.items || [];
      const pagination = list.result.pagination;

      prices = products.flatMap((prod) =>
        prod.prices.map((price) =>
          toPrice({
            price,
            type: prod.isRecurring ? "recurring" : "one_time",
            productId: prod.id,
          }),
        ),
      );

      hasMore = page < pagination.maxPage;
    }

    const nextCursor = hasMore ? (page + 1).toString() : undefined;

    return {
      data: {
        data: prices,
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
