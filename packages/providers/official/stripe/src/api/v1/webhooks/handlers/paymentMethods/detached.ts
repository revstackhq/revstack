import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPaymentMethodPayload } from "@/api/v1/payment-methods/mapper";

/** Handles a payment method detachment event. → PAYMENT_METHOD_DETACHED */
export const handlePaymentMethodDetached: WebhookHandler = async (
  raw,
  _ctx,
) => {
  const event = raw as Stripe.PaymentMethodDetachedEvent;
  const pm = event.data.object;
  return Promise.resolve({
    type: "PAYMENT_METHOD_DETACHED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pm.id,
    metadata: { ...pm.metadata },
    originalPayload: raw,
    data: toPaymentMethodPayload(pm),
  });
};
