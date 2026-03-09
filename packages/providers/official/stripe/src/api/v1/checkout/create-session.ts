import { toCheckoutResult } from "./mapper";
import {
  ProviderContext,
  CheckoutSessionInput,
  CheckoutSessionResult,
  AsyncActionResult,
  CatalogLineItem,
  getTrialDays,
  appendQueryParam,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import Stripe from "stripe";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Formats checkout line items into the provider's native format.
 * Since Revstack Cloud uses a JIT architecture, it guarantees that all items
 * already have a native provider Price ID before hitting the SDK.
 */
function formatLineItems(
  items: CatalogLineItem[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    price: item.priceId,
    quantity: item.quantity,
  }));
}

/**
 * Creates a hosted checkout session for payment, subscription, or setup flows.
 *
 * @param ctx - The provider context.
 * @param input - Session configuration: mode, line items, redirect URLs, metadata.
 * @returns An AsyncActionResult with a CheckoutSessionResult and a redirect next action.
 */
export async function createCheckoutSession(
  ctx: ProviderContext,
  input: CheckoutSessionInput,
): Promise<AsyncActionResult<CheckoutSessionResult>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  const automaticTax =
    ctx.config.useStripeTax === "true" || ctx.config.useStripeTax === true;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: input.mode,
      client_reference_id: input.clientReferenceId,
      metadata: {
        ...input.metadata,
        revstack_trace_id: ctx.traceId ?? null,
      },
      ui_mode: "hosted",
      success_url: input.successUrl
        ? appendQueryParam(input.successUrl, "session_id={CHECKOUT_SESSION_ID}")
        : undefined,
      cancel_url: input.cancelUrl,
      customer: input.customerId,
      currency: normalizeCurrency(input.currency ?? "USD", "lowercase"),
      customer_email: !input.customerId ? input.customerEmail : undefined,
      allow_promotion_codes: input.allowPromotionCodes,
      line_items:
        input.mode === "setup" ? undefined : formatLineItems(input.lineItems),
      automatic_tax: automaticTax ? { enabled: true } : undefined,
      billing_address_collection: automaticTax ? "required" : "auto",
      customer_update: input.customerId
        ? { address: "auto", name: "auto" }
        : undefined,
    };

    if (input.mode === "payment") {
      sessionParams.payment_intent_data = {
        setup_future_usage: input.savePaymentMethod ? "off_session" : undefined,
        metadata: input.metadata,
        statement_descriptor: input.statementDescriptor || undefined,
      };
    }

    if (input.mode === "subscription") {
      sessionParams.subscription_data = {
        metadata: input.metadata,
        trial_period_days:
          input.trialInterval && input.trialIntervalCount
            ? getTrialDays(input.trialInterval, input.trialIntervalCount)
            : undefined,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return {
      data: toCheckoutResult(session),
      status: "requires_action",
      nextAction: { type: "redirect", url: session.url! },
    };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: null, status: "failed", error: mapped };
  }
}
