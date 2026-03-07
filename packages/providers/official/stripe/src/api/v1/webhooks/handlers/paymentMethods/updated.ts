import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPaymentMethodPayload } from "@/api/v1/payment-methods/mapper";

/** Handles a payment method update event. → PAYMENT_METHOD_UPDATED */
export function handlePaymentMethodUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PaymentMethodUpdatedEvent;
  const pm = event.data.object;
  return {
    type: "PAYMENT_METHOD_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pm.id,
    customerId: typeof pm.customer === "string" ? pm.customer : pm.customer?.id,
    metadata: { ...pm.metadata },
    originalPayload: raw,
    data: toPaymentMethodPayload(pm),
  };
}
