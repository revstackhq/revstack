import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toPaymentPayload } from "@/api/v1/payments/mapper";
import type Stripe from "stripe";

/**
 * Handles a payment failure event.
 * Emitted when a payment attempt is declined or encounters an error.
 * Maps to: PAYMENT_FAILED
 */
export const handlePaymentFailed: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PaymentIntentPaymentFailedEvent;
  const pi = event.data.object;
  const lastError = pi.last_payment_error;

  const data = {
    ...toPaymentPayload(pi),
    paymentMethodId:
      lastError?.payment_method?.id ??
      (pi.payment_method as string | undefined) ??
      undefined,
    failureReason:
      lastError?.decline_code ?? lastError?.code ?? lastError?.message,
  };

  return Promise.resolve({
    type: "PAYMENT_FAILED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pi.id,
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    metadata: { ...pi.metadata },
    originalPayload: raw,
    data,
  });
};
