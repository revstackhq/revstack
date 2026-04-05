import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import { toCheckoutPayload } from "@/api/v1/checkout/mapper";
import type Stripe from "stripe";

export const handleCheckoutCanceled: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.Event;
  const session = event.data.object as Stripe.Checkout.Session;

  const data = toCheckoutPayload(session);

  return {
    type: "CHECKOUT_CANCELED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: session.id,
    customerId:
      (typeof session.customer === "string"
        ? session.customer
        : session.customer?.id) || undefined,
    metadata: { ...session.metadata },
    originalPayload: raw,
    data,
  };
};
