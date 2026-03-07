import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toPaymentPayload } from "@/api/v1/payments/mapper";
import type Stripe from "stripe";

/**
 * Handles a payment cancellation event.
 * Emitted when a payment is explicitly voided before funds are captured.
 * Maps to: PAYMENT_CANCELED
 */
export function handlePaymentCanceled(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PaymentIntentCanceledEvent;
  const pi = event.data.object;

  const data = {
    ...toPaymentPayload(pi),
    failureReason: pi.cancellation_reason ?? undefined,
  };

  return {
    type: "PAYMENT_CANCELED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pi.id,
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    metadata: { ...pi.metadata },
    originalPayload: raw,
    data,
  };
}
