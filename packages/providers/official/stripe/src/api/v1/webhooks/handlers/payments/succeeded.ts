import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toPaymentPayload } from "@/api/v1/payments/mapper";
import type Stripe from "stripe";

/**
 * Handles a payment success event.
 * Emitted when a payment is confirmed and funds are successfully captured.
 * Maps to: PAYMENT_SUCCEEDED
 */
export function handlePaymentSucceeded(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PaymentIntentSucceededEvent;
  const pi = event.data.object;

  const data = toPaymentPayload(pi);

  return {
    type: "PAYMENT_SUCCEEDED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pi.id,
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    metadata: { ...pi.metadata },
    originalPayload: raw,
    data,
  };
}
