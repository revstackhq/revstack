import Stripe from "stripe";
import {
  normalizeCurrency,
  SubscriptionMapper,
  SubscriptionPayload,
  SubscriptionStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Resolves the canonical SubscriptionStatus from the raw provider subscription object.
 * Handles provider-specific status quirks, such as pause states, and maps them
 * to the unified Revstack state machine.
 *
 * @param sub - The raw Stripe Subscription object.
 * @returns The normalized SubscriptionStatus enum value.
 */
function resolveStatus(sub: Stripe.Subscription): SubscriptionStatus {
  if (sub.pause_collection) return SubscriptionStatus.Paused;

  const statusMap: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.Active,
    trialing: SubscriptionStatus.Trialing,
    past_due: SubscriptionStatus.PastDue,
    unpaid: SubscriptionStatus.Unpaid,
    paused: SubscriptionStatus.Paused,
    incomplete: SubscriptionStatus.Incomplete,
    incomplete_expired: SubscriptionStatus.IncompleteExpired,
    canceled: SubscriptionStatus.Revoked,
  };

  return statusMap[sub.status] ?? SubscriptionStatus.Incomplete;
}

/**
 * Translates a raw provider subscription status string into the canonical SubscriptionStatus enum.
 * Use this overload when only the status string is available (e.g., inside a partial webhook delta).
 * For a full subscription object, prefer `toSubscription` which also handles pause states.
 *
 * @param status - The raw status string from the provider.
 * @returns The normalized SubscriptionStatus enum value.
 */
export function toSubscriptionStatus(status: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.Active,
    trialing: SubscriptionStatus.Trialing,
    past_due: SubscriptionStatus.PastDue,
    unpaid: SubscriptionStatus.Unpaid,
    paused: SubscriptionStatus.Paused,
    incomplete: SubscriptionStatus.Incomplete,
    incomplete_expired: SubscriptionStatus.IncompleteExpired,
    canceled: SubscriptionStatus.Revoked,
  };
  return statusMap[status] ?? SubscriptionStatus.Active;
}

export const toSubscription: SubscriptionMapper = (raw) => {
  const sub = raw as Stripe.Subscription;

  const baseAmount = sub.items.data.reduce((acc, item) => {
    return acc + (item.price?.unit_amount || 0) * (item.quantity || 1);
  }, 0);

  const mappedItems = sub.items.data.map((item) => ({
    externalId: item.id,
    priceId: typeof item.price === "string" ? item.price : item.price?.id || "",
    productId:
      typeof item.plan?.product === "string"
        ? item.plan.product
        : item.plan?.product?.id || "",
    quantity: item.quantity || 1,
    metadata: item.metadata || {},
  }));

  return {
    providerId: "stripe",
    id: sub.id,
    externalId: sub.id,
    status: resolveStatus(sub),
    amount: baseAmount,
    currency: normalizeCurrency(sub.currency, "uppercase"),
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,

    items: mappedItems,

    currentPeriodStart: fromUnixSeconds((sub as any).current_period_start),
    currentPeriodEnd: fromUnixSeconds((sub as any).current_period_end),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    startedAt: fromUnixSeconds(sub.start_date),

    canceledAt: sub.canceled_at ? fromUnixSeconds(sub.canceled_at) : undefined,
    trialStart: sub.trial_start ? fromUnixSeconds(sub.trial_start) : undefined,
    trialEnd: sub.trial_end ? fromUnixSeconds(sub.trial_end) : undefined,
    pauseResumesAt: sub.pause_collection?.resumes_at
      ? fromUnixSeconds(sub.pause_collection.resumes_at)
      : undefined,

    metadata: sub.metadata || {},
    raw: sub,
  };
};

// ─── Webhook Payload Builder ───────────────────────────────────────────────────

/**
 * Extracts a minimal SubscriptionPayload from a raw provider subscription object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw subscription object from a webhook event.
 * @returns A unified SubscriptionPayload for use in generic webhook handlers.
 */
export function toSubscriptionPayload(raw: any): SubscriptionPayload {
  const fullModel = toSubscription(raw);

  return {
    status: fullModel.status,
    currentPeriodStart: fullModel.currentPeriodStart,
    currentPeriodEnd: fullModel.currentPeriodEnd,
    cancelAtPeriodEnd: fullModel.cancelAtPeriodEnd,
  };
}
