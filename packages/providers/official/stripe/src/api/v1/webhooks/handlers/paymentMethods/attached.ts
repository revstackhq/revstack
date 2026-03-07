import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPaymentMethodPayload } from "@/api/v1/payment-methods/mapper";

/** Handles a payment method attachment event. → PAYMENT_METHOD_ATTACHED */
export function handlePaymentMethodAttached(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PaymentMethodAttachedEvent;
  const pm = event.data.object;
  return {
    type: "PAYMENT_METHOD_ATTACHED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: pm.id,
    customerId: typeof pm.customer === "string" ? pm.customer : pm.customer?.id,
    metadata: { ...pm.metadata },
    originalPayload: raw,
    data: toPaymentMethodPayload(pm),
  };
}
