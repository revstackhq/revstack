import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toCheckoutPayload } from "@/api/v1/checkout/mapper";
import type Stripe from "stripe";

/**
 * Handles a checkout session async payment failure event.
 * Emitted when a deferred payment within a completed session fails to settle.
 * Maps to: CHECKOUT_CANCELED
 */
export const handleCheckoutCanceled: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.CheckoutSessionAsyncPaymentFailedEvent;
  const session = event.data.object;

  const data = toCheckoutPayload(session);

  return Promise.resolve({
    type: "CHECKOUT_CANCELED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: session.id,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id,
    metadata: { ...session.metadata },
    originalPayload: raw,
    data,
  });
};
