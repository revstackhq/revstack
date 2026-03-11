import { toSubscriptionPayload } from "@/api/v1/subscriptions/mapper";
import {
  SubscriptionStatus,
  fromUnixSeconds,
  WebhookHandler,
} from "@revstackhq/providers-core";
import type Stripe from "stripe";

/**
 * Handles a subscription termination event.
 * Emitted when a subscription is permanently canceled by the provider or the merchant.
 * Maps to: SUBSCRIPTION_REVOKED
 */
export const handleSubscriptionRevoked: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.CustomerSubscriptionDeletedEvent;
  const sub = event.data.object;

  // Force status to Revoked — a terminated subscription is always in a terminal state
  // regardless of what the status field reports at the time of the event.
  const data = {
    ...toSubscriptionPayload(sub),
    status: SubscriptionStatus.Revoked,
    cancelAtPeriodEnd: false,
  };

  return Promise.resolve({
    type: "SUBSCRIPTION_REVOKED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: sub.id,
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    metadata: { ...sub.metadata },
    originalPayload: raw,
    data,
  });
};
