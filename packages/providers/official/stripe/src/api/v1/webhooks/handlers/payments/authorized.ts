import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toPaymentPayload } from "@/api/v1/payments/mapper";
import type Stripe from "stripe";

/**
 * Handles a payment authorization event.
 * Emitted when a payment is authorized (funds held) but not yet captured.
 * Maps to: PAYMENT_AUTHORIZED
 */
export const handlePaymentAuthorized: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PaymentIntentAmountCapturableUpdatedEvent;
  const pi = event.data.object;

  const data = toPaymentPayload(pi);

  return Promise.resolve({
    type: "PAYMENT_AUTHORIZED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pi.id,
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    metadata: { ...pi.metadata },
    originalPayload: raw,
    data,
  });
};
