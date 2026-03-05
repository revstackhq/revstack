import {
  Address,
  Customer,
  normalizeCurrency,
  Payment,
  PaymentMethod,
  PaymentMethodDetails,
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from "@revstackhq/providers-core";
import Stripe from "stripe";

// stripe sdk types don't expose current_period_start/end even though the API returns them
interface StripeSubscriptionWithPeriods extends Stripe.Subscription {
  current_period_start?: number;
  current_period_end?: number;
}

/**
 * Evaluates the raw Stripe Subscription object to determine the true lifecycle status.
 * Specifically intercepts Stripe's `pause_collection` behavior, which Stripe leaves as 'active',
 * but Revstack normalizes to 'paused' for better merchant UX.
 *
 * @param sub - The raw Stripe Subscription object.
 * @returns The standardized Revstack SubscriptionStatus.
 */
function getNormalizedStatus(sub: Stripe.Subscription): SubscriptionStatus {
  if (sub.pause_collection) {
    return SubscriptionStatus.Paused;
  }

  const statusMap: Record<string, SubscriptionStatus> = {
    active: SubscriptionStatus.Active,
    past_due: SubscriptionStatus.PastDue,
    canceled: SubscriptionStatus.Canceled,
    trialing: SubscriptionStatus.Trialing,
    incomplete: SubscriptionStatus.Incomplete,
    incomplete_expired: SubscriptionStatus.IncompleteExpired,
    unpaid: SubscriptionStatus.Unpaid,
  };

  return statusMap[sub.status] || SubscriptionStatus.Incomplete;
}

export function mapStripeStatusToPaymentStatus(status: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    succeeded: PaymentStatus.Succeeded,
    requires_payment_method: PaymentStatus.Pending,
    requires_confirmation: PaymentStatus.Pending,
    requires_action: PaymentStatus.RequiresAction,
    canceled: PaymentStatus.Canceled,
    processing: PaymentStatus.Pending,
  };
  return map[status] || PaymentStatus.Pending;
}

export function mapStripeSubStatusToSubscriptionStatus(
  status: string,
): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    incomplete: SubscriptionStatus.Incomplete,
    incomplete_expired: SubscriptionStatus.IncompleteExpired,
    trialing: SubscriptionStatus.Trialing,
    active: SubscriptionStatus.Active,
    past_due: SubscriptionStatus.PastDue,
    canceled: SubscriptionStatus.Canceled,
    unpaid: SubscriptionStatus.Unpaid,
    paused: SubscriptionStatus.Paused,
  };
  return map[status] || SubscriptionStatus.Active;
}

export function mapSessionToCheckoutResult(session: Stripe.Checkout.Session) {
  return {
    id: session.id,
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : undefined,
  };
}

export function mapStripePaymentToPayment(pi: Stripe.PaymentIntent): Payment {
  let amountRefunded = 0;
  if (pi.latest_charge && typeof pi.latest_charge === "object") {
    amountRefunded = (pi.latest_charge as Stripe.Charge).amount_refunded || 0;
  }

  const hasMetadata = pi.metadata && Object.keys(pi.metadata).length > 0;

  return {
    id: pi.id,
    providerId: "stripe",
    externalId: pi.id,
    amount: pi.amount,
    amountRefunded,
    currency: normalizeCurrency(pi.currency, "uppercase"),
    status: mapStripeStatusToPaymentStatus(pi.status),
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    createdAt: new Date(pi.created * 1000).toISOString(),
    metadata: hasMetadata ? pi.metadata : undefined,
    raw: pi,
  };
}

/**
 * Transforms a raw Stripe Subscription into a normalized Revstack Subscription payload.
 * * Note: This mapper omits `id` and `planId`. The Provider Adapter's job is purely to translate
 * external data. Your database layer (Prisma/Supabase) is responsible for injecting internal
 * UUIDs and resolving the correct internal Plan ID before saving.
 *
 * @param sub - The raw Stripe Subscription object fetched from the API or a Webhook.
 * @returns A normalized payload ready to be enriched with internal IDs and persisted.
 */
export function mapStripeSubscriptionToSubscription(
  rawSub: Stripe.Subscription,
): Subscription {
  const sub = rawSub as StripeSubscriptionWithPeriods;
  // Safely aggregate the total amount across all subscription items (vital for B2B multi-item pricing)
  const totalAmount = sub.items.data.reduce((acc, item) => {
    const itemAmount = item.price?.unit_amount || 0;
    const quantity = item.quantity || 1;
    return acc + itemAmount * quantity;
  }, 0);

  // Extract the main billing interval, defaulting to 'month' as a fallback
  const mainInterval = sub.items.data[0]?.price?.recurring?.interval || "month";

  // Safely extract the current period start and end timestamps
  const periodStartTs =
    sub.current_period_start ||
    sub.items.data[0]?.current_period_start ||
    sub.start_date ||
    sub.created;

  // Safely extract the current period end timestamp
  const periodEndTs =
    sub.current_period_end ||
    sub.items.data[0]?.current_period_end ||
    sub.billing_cycle_anchor ||
    sub.created;

  return {
    providerId: "stripe",
    id: sub.id,
    priceId: sub.items.data[0]?.price?.id,
    status: getNormalizedStatus(sub),

    amount: totalAmount,
    currency: normalizeCurrency(sub.currency, "uppercase"),
    interval: mainInterval,

    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,

    currentPeriodStart: new Date(periodStartTs * 1000).toISOString(),
    currentPeriodEnd: new Date(periodEndTs * 1000).toISOString(),

    cancelAtPeriodEnd: sub.cancel_at_period_end,
    startedAt: new Date(sub.start_date * 1000).toISOString(),

    canceledAt: sub.canceled_at
      ? new Date(sub.canceled_at * 1000).toISOString()
      : undefined,
    trialStart: sub.trial_start
      ? new Date(sub.trial_start * 1000).toISOString()
      : undefined,
    trialEnd: sub.trial_end
      ? new Date(sub.trial_end * 1000).toISOString()
      : undefined,

    pauseResumesAt: sub.pause_collection?.resumes_at
      ? new Date(sub.pause_collection.resumes_at * 1000).toISOString()
      : undefined,

    metadata: sub.metadata || {},
    raw: sub,
  };
}

export function mapStripeCustomerToCustomer(
  cust: Stripe.Customer | Stripe.DeletedCustomer,
): Customer {
  if (cust.deleted) {
    return {
      id: cust.id,
      providerId: "stripe",
      externalId: cust.id,
      email: "",
      createdAt: new Date().toISOString(),
      metadata: { deleted: "true" },
    };
  }

  const c = cust as Stripe.Customer;

  return {
    id: c.id,
    providerId: "stripe",
    externalId: c.id,
    email: c.email || "",
    name: c.name || undefined,
    phone: c.phone || undefined,
    metadata: c.metadata,
    createdAt: new Date(c.created * 1000).toISOString(),
  };
}

export function mapStripePaymentMethodToPaymentMethod(
  pm: Stripe.PaymentMethod,
  defaultPaymentMethodId?: string | null,
): PaymentMethod {
  let details: PaymentMethodDetails = { type: "card" };

  if (pm.type === "card" && pm.card) {
    details = {
      type: "card",
      brand: pm.card.brand,
      last4: pm.card.last4,
      expiryMonth: pm.card.exp_month,
      expiryYear: pm.card.exp_year,
      cardHolderName: pm.billing_details?.name || undefined,
    };
  } else if (pm.type === "us_bank_account") {
    details = { type: "bank_transfer", brand: "ach" };
  }

  return {
    id: pm.id,
    customerId:
      typeof pm.customer === "string" ? pm.customer : pm.customer?.id || "",
    externalId: pm.id,
    type: "card",
    details: details,
    isDefault: !!defaultPaymentMethodId && pm.id === defaultPaymentMethodId,
    metadata: pm.metadata || {},
  };
}

export function mapAddressToStripe(
  addr?: Address,
): Stripe.AddressParam | undefined {
  if (!addr) return undefined;
  return {
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postal_code: addr.postalCode,
    country: addr.country,
  };
}
