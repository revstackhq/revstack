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
import Stripe from "stripe";

/**
 * Generates a shareable, standalone payment link.
 *
 * All line items must be `CatalogLineItem` (pre-created price IDs).
 * AdHoc line items are not supported by Stripe payment links natively.
 */
export async function createPaymentLink(
  ctx: ProviderContext,
  input: CreatePaymentLinkInput,
): Promise<AsyncActionResult<string>> {
  // Validate all line items are CatalogLineItem
  if (!input.lineItems.every(isCatalogItem)) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.InvalidInput,
        message:
          "Stripe payment links require all line items to be CatalogLineItems with a priceId. AdHoc line items are not supported.",
      },
    };
  }

  const catalogItems = input.lineItems as CatalogLineItem[];

  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);

    const stripeLineItems: Stripe.PaymentLinkCreateParams.LineItem[] =
      catalogItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity ?? 1,
      }));

    const linkParams: Stripe.PaymentLinkCreateParams = {
      line_items: stripeLineItems,
      metadata: {
        ...input.metadata,
        ...(input.customerId ? { customer_id: input.customerId } : {}),
      },
    };

    const paymentLink = await stripe.paymentLinks.create(linkParams);

    return { data: paymentLink.url, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
