import {
  Subscription,
  SubscriptionStatus,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import { Subscription as PolarSubscription } from "@polar-sh/sdk/models/components/subscription.js";

export function mapPolarSubStatusToSubscriptionStatus(
  status: string,
): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    incomplete: SubscriptionStatus.Incomplete,
    incomplete_expired: SubscriptionStatus.IncompleteExpired,
    trialing: SubscriptionStatus.Trialing,
    active: SubscriptionStatus.Active,
    past_due: SubscriptionStatus.PastDue,
    canceled: SubscriptionStatus.Incomplete,
    unpaid: SubscriptionStatus.Unpaid,
  };
  return map[status] || SubscriptionStatus.Active;
}

export function mapPolarSubscriptionToSubscription(
  rawSub: PolarSubscription,
): Subscription {
  const sub = rawSub;

  return {
    id: sub.id,
    providerId: "polar",
    externalId: sub.id,
    items: sub.prices.map((price) => ({
      priceId: price.id,
      quantity: 1,
      externalId: price.id,
      productId: price.productId,
    })),
    endedAt: sub.endedAt ? new Date(sub.endedAt) : undefined,
    status: mapPolarSubStatusToSubscriptionStatus(sub.status),
    amount: sub.amount || 0,
    trialEnd: sub.trialEnd ? new Date(sub.trialEnd) : undefined,
    trialStart: sub.trialStart ? new Date(sub.trialStart) : undefined,
    currency: normalizeCurrency(sub.currency, "uppercase"),
    customerId: sub.customerId,
    currentPeriodStart: new Date(sub.currentPeriodStart),
    currentPeriodEnd: sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd)
      : new Date(sub.currentPeriodStart),
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    startedAt: sub.startedAt ? new Date(sub.startedAt) : new Date(),
    canceledAt: sub.canceledAt ? new Date(sub.canceledAt) : undefined,
    raw: sub,
  };
}
