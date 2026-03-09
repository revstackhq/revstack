import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  GetPriceInput,
  Price,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toPrice } from "@/api/v1/prices/mapper";

/**
 * Retrieves a price by its external ID from the provider's catalog.
 *
 * @param ctx - The provider execution context.
 * @param input - Contains the price ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Price entity.
 */
export async function getPrice(
  ctx: ProviderContext,
  input: GetPriceInput,
): Promise<AsyncActionResult<Price>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const price = await stripe.prices.retrieve(input.id);

    return { data: toPrice(price), status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
