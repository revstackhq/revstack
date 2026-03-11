import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toCheckoutPayload } from "@/api/v1/checkout/mapper";
import type Stripe from "stripe";

/**
 * Handles a checkout session expiry event.
 * Emitted when a hosted payment session expires without the customer completing it.
 * Maps to: CHECKOUT_EXPIRED
 */
export const handleCheckoutExpired: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.CheckoutSessionExpiredEvent;
  const session = event.data.object;

  const data = toCheckoutPayload(session);

  return Promise.resolve({
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
  });
};
