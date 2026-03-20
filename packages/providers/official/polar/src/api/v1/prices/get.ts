import { getOrCreateClient } from "@/api/v1/client";
import { toPrice } from "@/api/v1/prices/mapper";
import { mapError } from "@/shared/error-map";
import {
  AsyncActionResult,
  GetPriceInput,
  Price,
  ProviderContext,
  RevstackError,
  RevstackErrorCode,
} from "@revstackhq/providers-core";

/**
 * Retrieves a price from Polar.
 * Since Polar prices are embedded, we use our Composite ID to fetch the product
 * and then locate the specific price within its array.
 */
export async function getPrice(
  ctx: ProviderContext,
  input: GetPriceInput,
): Promise<AsyncActionResult<Price>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    const [productId, priceId] = input.id.split("|");

    if (!productId || !priceId) {
      throw new RevstackError({
        code: RevstackErrorCode.InvalidInput,
        cause: "INVALID_ID",
        message:
          "Invalid Composite Price ID. Expected format: productId|priceId",
      });
    }

    const product = await polar.products.get({ id: productId });

    const price = product.prices.find((p) => p.id === priceId);

    if (!price) {
      throw new RevstackError({
        code: RevstackErrorCode.ResourceNotFound,
        cause: "PRICE_NOT_FOUND",
        message: `Price ${priceId} not found in Product ${productId}`,
      });
    }

    const type = product.isRecurring ? "recurring" : "one_time";

    return {
      data: toPrice({ productId: product.id, type, price }),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
