import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreatePaymentLinkInput,
  AsyncActionResult,
  CatalogLineItem,
  isCatalogItem,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Creates a standalone payment link using Polar's checkouts API.
 */
export async function createPaymentLink(
  ctx: ProviderContext,
  input: CreatePaymentLinkInput,
): Promise<AsyncActionResult<string>> {
  if (!input.lineItems.every(isCatalogItem)) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.UnsupportedFeature,
        message:
          "Polar requires pre-created products (catalog items) for payment links. Ad-hoc prices are not supported.",
      },
    };
  }

  const catalogItems = input.lineItems as CatalogLineItem[];

  try {
    const polar = getOrCreateClient(ctx);

    const checkout = await polar.checkoutLinks.create({
      paymentProcessor: "stripe",
      products: catalogItems.map((item) => item.priceId),
      metadata: {
        ...input.metadata,
      },
      successUrl: input.successUrl,
      returnUrl: input.returnUrl,
      allowDiscountCodes: input.allowPromotionCodes,
      discountId: input.promotionCodeId,
      label: input.label,
      trialInterval: input.trialInterval,
      trialIntervalCount: input.trialIntervalCount,
    });

    return {
      data: checkout.url,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
