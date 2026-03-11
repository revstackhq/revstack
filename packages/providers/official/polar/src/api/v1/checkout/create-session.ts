import { mapSessionToCheckoutResult } from "@/api/v1/checkout/mapper";
import {
  ProviderContext,
  CheckoutSessionInput,
  CheckoutSessionResult,
  AsyncActionResult,
  RevstackErrorCode,
  CatalogLineItem,
  appendQueryParam,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { CheckoutCreate } from "@polar-sh/sdk/models/components/checkoutcreate.js";
import { mapError } from "@/shared/error-map";

/**
 * Creates a Polar Checkout Session using the defined products or prices.
 * Maps Revstack standard line items to native Polar checkout payload.
 *
 * @param ctx - The provider execution context.
 * @param input - The checkout session configuration input.
 * @returns The created checkout session result containing the redirect URL.
 */
export async function createCheckoutSession(
  ctx: ProviderContext,
  input: CheckoutSessionInput,
): Promise<AsyncActionResult<CheckoutSessionResult>> {
  const polar = getOrCreateClient(ctx);

  try {
    const products: string[] = (input.lineItems as CatalogLineItem[])
      .filter((item) => item.priceId)
      .map((item) => item.priceId);

    if (products.length === 0) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.InvalidInput,
          message:
            "Failed to create checkout session. Please ensure you have a valid product or price.",
          providerError: "missing_product",
        },
      };
    }

    const cleanMetadata: Record<string, string | number | boolean> = {};
    if (input.metadata) {
      Object.entries(input.metadata).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          cleanMetadata[k] = v;
        }
      });
    }

    if (ctx.traceId) {
      cleanMetadata.revstack_trace_id = ctx.traceId;
    }

    const sessionPayload: CheckoutCreate = {
      products,
      successUrl:
        input.successUrl &&
        appendQueryParam(input.successUrl, "session_id={CHECKOUT_SESSION_ID}"),
      customerId: input.customerId,
      customerEmail: !input.customerId ? input.customerEmail : undefined,
      allowDiscountCodes: input.allowPromotionCodes,
      metadata: cleanMetadata,
      allowTrial: input.mode === "subscription",
      returnUrl: input.successUrl,
      trialInterval: input.trialInterval,
      trialIntervalCount: input.trialIntervalCount,
      discountId: input.promotionCodeId,
    };

    const session = await polar.checkouts.create(sessionPayload);

    return {
      data: mapSessionToCheckoutResult(session),
      status: "requires_action",
      nextAction: {
        type: "redirect",
        url: `${session.url}?theme=dark`,
      },
    };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return {
      data: null,
      status: "failed",
      error: mapped,
    };
  }
}
