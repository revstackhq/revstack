import { toSubscriptionPayload } from "@/api/v1/subscriptions/mapper";
import {
  RevstackEvent,
  SubscriptionPayload,
  SubscriptionStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import type Stripe from "stripe";

/**
 * Handles a subscription resume event.
 * Emitted when billing collection resumes on a previously paused subscription.
 * Maps to: SUBSCRIPTION_RESUMED
 */
export function handleSubscriptionResumed(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CustomerSubscriptionResumedEvent;
  const sub = event.data.object;

  const data = {
    ...toSubscriptionPayload(sub),
    status: SubscriptionStatus.Active,
  };

  return {
    type: "SUBSCRIPTION_RESUMED",
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
