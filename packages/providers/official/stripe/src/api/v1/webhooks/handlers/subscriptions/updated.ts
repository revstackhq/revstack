import {
  EventType,
  RevstackEvent,
  SubscriptionPayload,
  SubscriptionStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import type Stripe from "stripe";
import {
  toSubscriptionPayload,
  toSubscriptionStatus,
} from "@/api/v1/subscriptions/mapper";

/**
 * Handles a subscription change event.
 * Routes to SUBSCRIPTION_UPDATED, SUBSCRIPTION_RENEWED, SUBSCRIPTION_PAST_DUE,
 * or SUBSCRIPTION_CANCELED based on the resulting status and billing period change.
 */
export function handleSubscriptionUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CustomerSubscriptionUpdatedEvent;
  const sub = event.data.object;
  const prev = event.data.previous_attributes;

  const data = toSubscriptionPayload(sub);
  const mappedStatus = toSubscriptionStatus(sub.status);

  // Detect a billing cycle renewal: the billing period advanced and the subscription is still active.
  const periodChanged =
    (prev as any)?.current_period_start !== undefined &&
    (prev as any).current_period_start !== (sub as any).current_period_start;

  let type: EventType = "SUBSCRIPTION_UPDATED";
  if (mappedStatus === SubscriptionStatus.PastDue)
    type = "SUBSCRIPTION_PAST_DUE";
  else if (mappedStatus === SubscriptionStatus.Revoked)
    type = "SUBSCRIPTION_CANCELED";
  else if (periodChanged && mappedStatus === SubscriptionStatus.Active)
    type = "SUBSCRIPTION_RENEWED";

  return {
    type,
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
