import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toCheckoutPayload } from "@/api/v1/checkout/mapper";
import type Stripe from "stripe";

/**
 * Handles a checkout session expiry event.
 * Emitted when a hosted payment session expires without the customer completing it.
 * Maps to: CHECKOUT_EXPIRED
 */
export function handleCheckoutExpired(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CheckoutSessionExpiredEvent;
  const session = event.data.object;

  const data = toCheckoutPayload(session);

  return {
    type: "CHECKOUT_EXPIRED",
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
  };
}
