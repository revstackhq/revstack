import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreatePriceInput,
  AsyncActionResult,
  normalizeCurrency,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

// 🔥 Importamos los tipos estrictos de creación de Polar
import type { ProductPriceFixedCreate } from "@polar-sh/sdk/models/components/productpricefixedcreate.js";
import type { ProductPriceMeteredUnitCreate } from "@polar-sh/sdk/models/components/productpricemeteredunitcreate.js";
import type { ProductPriceFreeCreate } from "@polar-sh/sdk/models/components/productpricefreecreate.js";
import type { ProductPriceCustomCreate } from "@polar-sh/sdk/models/components/productpricecustomcreate.js";

/**
 * Creates a new price attached to a product in Polar.
 * Includes a strictly typed Reverse Mapper to translate Revstack's
 * universal billing schemes back into Polar's specific amountTypes.
 */
export async function createPrice(
  ctx: ProviderContext,
  input: CreatePriceInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    // 1. Fetch the existing product
    const product = await polar.products.get({ id: input.productId });

    // Polar expects an array of objects with just the ID for existing prices
    const existingPrices = product.prices.map((p: any) => ({ id: p.id }));

    const currency = normalizeCurrency(input.currency, "lowercase");

    let newPrice:
      | ProductPriceFixedCreate
      | ProductPriceMeteredUnitCreate
      | ProductPriceFreeCreate
      | ProductPriceCustomCreate;

    switch (input.billingScheme) {
      case "free":
        newPrice = {
          amountType: "free",
          priceCurrency: currency,
        } as ProductPriceFreeCreate;
        break;

      case "metered":
        newPrice = {
          amountType: "metered_unit",
          priceAmount: input.unitAmount,
          priceCurrency: currency,
          unitAmount: input.unitAmount,
          meterId: input.meterId,
        } as ProductPriceMeteredUnitCreate;
        break;

      case "tiered_volume":
      case "tiered_graduated":
      case "flat":
      case "per_unit":
      default:
        newPrice = {
          amountType: "fixed",
          priceAmount: input.unitAmount,
          priceCurrency: currency,
        } as ProductPriceFixedCreate;
        break;
    }

    const updatedProduct = await polar.products.update({
      id: input.productId,
      productUpdate: {
        prices: [...existingPrices, newPrice],
      },
    });

    const originalPriceIds = new Set(existingPrices.map((p) => p.id));
    const createdPrice = updatedProduct.prices.find(
      (p: any) => !originalPriceIds.has(p.id),
    );

    if (!createdPrice) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.InternalError,
          message:
            "Price was created but could not be identified in the Polar response.",
        },
      };
    }

    const compositeId = `${input.productId}|${createdPrice.id}`;

    return { data: compositeId, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null as any, status: "failed", error: error.errorPayload };
    }
    return { data: null as any, status: "failed", error: mapError(error) };
  }
}
