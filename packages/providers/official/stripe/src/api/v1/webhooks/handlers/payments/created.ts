import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toPaymentPayload } from "@/api/v1/payments/mapper";
import type Stripe from "stripe";

/**
 * Handles a payment creation event.
 * Emitted when a new payment is initiated, before any authorization attempt.
 * Maps to: PAYMENT_CREATED
 */
export const handlePaymentCreated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PaymentIntentCreatedEvent;
  const pi = event.data.object;

  const data = {
    ...toPaymentPayload(pi),
    failureReason: undefined,
  };

  return Promise.resolve({
    type: "PAYMENT_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pi.id,
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    metadata: { ...pi.metadata },
    originalPayload: raw,
    data,
  });
};
