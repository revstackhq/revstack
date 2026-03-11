import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreatePriceInput,
  AsyncActionResult,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Creates a new price attached to a product in the provider's catalog.
 * Handles both one-time and recurring pricing models.
 *
 * @param ctx - The provider execution context.
 * @param input - The price data (productId, unitAmount, currency, interval).
 * @returns An AsyncActionResult yielding the newly created price ID.
 */
export async function createPrice(
  ctx: ProviderContext,
  input: CreatePriceInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    const params = {
      product: input.productId,
      unit_amount: input.unitAmount,
      currency: normalizeCurrency(input.currency, "lowercase"),
      active: input.active ?? true,
      metadata: input.metadata as Record<string, string> | undefined,
    };

    if (input.interval) {
      params.recurring = {
        interval: input.interval,
        interval_count: input.intervalCount ?? 1,
      };
    }

    const price = await polar.prices.create(params, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: price.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
