import { toSubscriptionPayload } from "@/api/v1/subscriptions/mapper";
import {
  RevstackEvent,
  SubscriptionPayload,
  SubscriptionStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import type Stripe from "stripe";

/**
 * Handles a subscription pause event.
 * Emitted when billing collection is temporarily halted on an active subscription.
 * Maps to: SUBSCRIPTION_PAUSED
 */
export function handleSubscriptionPaused(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CustomerSubscriptionPausedEvent;
  const sub = event.data.object;

  const data = {
    ...toSubscriptionPayload(sub),
    status: SubscriptionStatus.Paused,
  };

  return {
    type: "SUBSCRIPTION_PAUSED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: sub.id,
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    metadata: { ...sub.metadata },
    originalPayload: raw,
    data,
  };
}
