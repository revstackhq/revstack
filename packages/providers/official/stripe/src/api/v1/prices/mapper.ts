import Stripe from "stripe";
import {
  PricePayload,
  PriceMapper,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Empty PriceMapper for scaffolding. Replace with actual entity fields when needed.
 */
export const toPrice: PriceMapper = (raw) => {
  const price = raw as Stripe.Price;

  return {
    id: price.id,
    type: price.type,
    productId:
      typeof price.product === "string"
        ? price.product
        : (price.product?.id ?? ""),
    createdAt: fromUnixSeconds(price.created),
    currency: price.currency,
    unitAmount: price.unit_amount ?? 0,
    active: price.active,
    metadata: price.metadata,
    providerId: "stripe",
    raw: price,
  };
};

/**
 * Extracts a minimal PricePayload from a raw provider price object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw price object from a webhook event body.
 * @returns A PricePayload for use in RevstackEvent.data.
 */
export function toPricePayload(raw: any): PricePayload {
  const price = raw as Stripe.Price;
  return {
    productId: price.product as string,
    unitAmount: price.unit_amount ?? 0,
    currency: price.currency,
    active: price.active,
    type: price.type,
    billingScheme: price.billing_scheme,
    interval: price.recurring?.interval,
    intervalCount: price.recurring?.interval_count,
  };
}
