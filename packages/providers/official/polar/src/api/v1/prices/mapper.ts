import { ProductPrice } from "@polar-sh/sdk/models/components/productprice.js";
import { ProductPriceMeteredUnit } from "@polar-sh/sdk/models/components/productpricemeteredunit.js";
import { ProductPriceSeatBased } from "@polar-sh/sdk/models/components/productpriceseatbased.js";
import {
  normalizeCurrency,
  Price,
  PriceBillingScheme,
} from "@revstackhq/providers-core";

/**
 * Maps a Polar ProductPrice to the canonical Revstack Price Union Type.
 * * @remarks
 * - 'seat_based' is pragmatically mapped to 'per_unit' using the first tier.
 * - 'meterId' has been abstracted out of the Catalog to the Master Ledger DB,
 * so this mapper is now a pure translation function.
 */
export function toPrice({
  productId,
  type,
  price,
}: {
  productId: string;
  type: "recurring" | "one_time";
  price: ProductPrice;
}): Price {
  // 1. Determine the canonical Billing Scheme
  let billingScheme: PriceBillingScheme = "per_unit";

  switch (price.amountType) {
    case "fixed":
      billingScheme = type === "recurring" ? "flat" : "per_unit";
      break;
    case "metered_unit":
      billingScheme = "metered";
      break;
    case "seat_based":
      // We map this to 'per_unit' as a pragmatic first step
      billingScheme = "per_unit";
      break;
    case "custom":
      billingScheme = "custom";
      break;
    case "free":
      billingScheme = "free";
      break;
  }

  // 2. Base properties shared by all Revstack Price types
  const base = {
    id: `${productId}|${price.id}`,
    productId: productId,
    active: !price.isArchived,
    currency: normalizeCurrency(price.priceCurrency, "uppercase"),
    type,
    createdAt: new Date(price.createdAt),
    unitLabel: price.amountType === "seat_based" ? "seat" : undefined,
  };

  // 3. Discriminated Union Return
  switch (billingScheme) {
    case "metered": {
      const meteredPrice = price as ProductPriceMeteredUnit;
      return {
        ...base,
        billingScheme: "metered",
        unitAmount: Number(meteredPrice.unitAmount),
      };
    }

    case "free":
      return {
        ...base,
        billingScheme: "free",
      };

    case "flat":
    case "per_unit":
    default: {
      let unitAmount = 0;

      if (price.amountType === "fixed") {
        unitAmount = Number(price.priceAmount);
      } else if (price.amountType === "seat_based") {
        const seatPrice = price as ProductPriceSeatBased;
        const firstTier = seatPrice.seatTiers.tiers[0];
        unitAmount = Number(firstTier?.pricePerSeat || 0);
      }

      return {
        ...base,
        billingScheme,
        unitAmount,
      };
    }
  }
}
