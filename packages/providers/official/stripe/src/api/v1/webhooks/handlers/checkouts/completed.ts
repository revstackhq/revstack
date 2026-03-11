import { toCheckoutPayload } from "@/api/v1/checkout/mapper";
import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";

/**
 * Handles a checkout session completion event.
 * Emitted when a customer successfully completes a hosted payment session.
 * Maps to: CHECKOUT_COMPLETED
 */
export const handleCheckoutCompleted: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.CheckoutSessionCompletedEvent;
  const session = event.data.object;

  const data = toCheckoutPayload(session);

  return Promise.resolve({
    type: "CHECKOUT_COMPLETED",
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
