import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toSubscriptionPayload } from "@/api/v1/subscriptions/mapper";

/**
 * Handles a subscription creation event.
 * Emitted when a new subscription is successfully activated.
 * Maps to: SUBSCRIPTION_CREATED
 */
export const handleSubscriptionCreated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.CustomerSubscriptionCreatedEvent;
  const sub = event.data.object;

  const data = toSubscriptionPayload(sub);

  return Promise.resolve({
    type: "SUBSCRIPTION_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: sub.id,
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    metadata: { ...sub.metadata },
    originalPayload: raw,
    data,
  });
};
