import Stripe from "stripe";
import {
  Price,
  PricePayload,
  PriceMapper,
  fromUnixSeconds,
  normalizeCurrency,
  PriceBillingScheme,
} from "@revstackhq/providers-core";

/**
 * Extracts the exact Billing Scheme from a Stripe Price object.
 * (Shared logic between full entity mapping and webhook payloads)
 */
function extractBillingScheme(price: Stripe.Price): PriceBillingScheme {
  if (price.billing_scheme === "tiered") {
    return price.tiers_mode === "graduated"
      ? "tiered_graduated"
      : "tiered_volume";
  }
  if (price.recurring?.usage_type === "metered") {
    return "metered";
  }
  if (price.type === "one_time" && price.unit_amount !== null) {
    return "flat";
  }
  if (price.unit_amount === 0) {
    return "free";
  }
  return "per_unit"; // Fallback default
}

/**
 * Maps a raw Stripe Price object to the canonical Revstack Price Union Type.
 */
export const toPrice: PriceMapper = (raw): Price => {
  const price = raw as Stripe.Price;
  const billingScheme = extractBillingScheme(price);

  // Base properties shared by all Revstack Price types
  const base = {
    id: price.id,
    productId:
      typeof price.product === "string" ? price.product : price.product.id,
    active: price.active,
    currency: normalizeCurrency(price.currency, "uppercase"),
    type: price.type,
    createdAt: fromUnixSeconds(price.created),
    interval: price.recurring?.interval,
    intervalCount: price.recurring?.interval_count,
    metadata: price.metadata,
    raw: price,
  };

  // Return the specific Union member
  switch (billingScheme) {
    case "metered":
      return {
        ...base,
        billingScheme: "metered",
        unitAmount: price.unit_amount ?? 0,
        // No meterId needed here anymore! Core DB handles it.
      };

    case "tiered_volume":
    case "tiered_graduated":
      return {
        ...base,
        billingScheme: billingScheme,
        tiers: (price.tiers || []).map((t, index, array) => {
          // Calculate the lower bound based on the previous tier
          const minUnits = index === 0 ? 0 : array?.[index - 1]?.up_to || 0;

          return {
            minUnits,
            maxUnits: t.up_to,
            unitAmount: t.unit_amount ?? 0,
            flatAmount: t.flat_amount ?? undefined,
          };
        }),
      };

    case "free":
      return { ...base, billingScheme: "free" };

    case "flat":
    case "per_unit":
    default:
      return {
        ...base,
        billingScheme: billingScheme as "flat" | "per_unit",
        unitAmount: price.unit_amount ?? 0,
      };
  }
};

/**
 * Extracts a minimal PricePayload for webhook events.
 */
export function toPricePayload(raw: any): PricePayload {
  const price = raw as Stripe.Price;
  const billingScheme = extractBillingScheme(price);

  return {
    productId:
      typeof price.product === "string" ? price.product : price.product.id,
    unitAmount: price.unit_amount ?? 0,
    currency: normalizeCurrency(price.currency, "uppercase"),
    active: price.active,
    type: price.type as "one_time" | "recurring",
    billingScheme,
    interval: price.recurring?.interval,
    intervalCount: price.recurring?.interval_count,
  };
}
