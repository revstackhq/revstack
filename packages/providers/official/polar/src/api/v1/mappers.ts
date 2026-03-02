import {
  Subscription,
  SubscriptionStatus,
  Payment,
  PaymentStatus,
  Customer,
} from "@revstackhq/providers-core";
import { Subscription as PolarSubscription } from "@polar-sh/sdk/models/components/subscription.js";
import { Order as PolarOrder } from "@polar-sh/sdk/models/components/order.js";
import { Customer as PolarCustomer } from "@polar-sh/sdk/models/components/customer.js";
import { currencyMap } from "@/shared/currency-map";

export function mapPolarSubStatusToSubscriptionStatus(
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
  };
  return map[status] || SubscriptionStatus.Active;
}

export function mapPolarOrderStatusToPaymentStatus(
  status: string,
): PaymentStatus {
  return status === "paid" ? PaymentStatus.Succeeded : PaymentStatus.Pending;
}

export function mapSessionToCheckoutResult(session: any) {
  return {
    id: session.id,
    expiresAt: session.expiresAt
      ? new Date(session.expiresAt).toISOString()
      : undefined,
  };
}

export function mapPolarSubscriptionToSubscription(
  sub: PolarSubscription,
): Subscription {
  return {
    id: sub.id,
    providerId: "polar",
    externalId: sub.id,
    status: mapPolarSubStatusToSubscriptionStatus(sub.status),

    amount: sub.amount || 0,
    currency: currencyMap[sub.currency as keyof typeof currencyMap] as any,
    interval: sub.recurringInterval === "year" ? "year" : "month",

    customerId: sub.customerId,

    currentPeriodStart: new Date(sub.currentPeriodStart).toISOString(),
    currentPeriodEnd: sub.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).toISOString()
      : new Date(sub.currentPeriodStart).toISOString(),

    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    startedAt: sub.startedAt
      ? new Date(sub.startedAt).toISOString()
      : new Date().toISOString(),
    canceledAt: sub.canceledAt
      ? new Date(sub.canceledAt).toISOString()
      : undefined,

    raw: sub,
  };
}

export function mapPolarOrderToPayment(order: PolarOrder): Payment {
  return {
    id: order.id,
    providerId: "polar",
    externalId: order.id,
    amount: order.subtotalAmount || 0,
    amountRefunded: order.refundedAmount || 0,
    currency: currencyMap[order.currency as keyof typeof currencyMap],
    status: mapPolarOrderStatusToPaymentStatus(order.status),
    customerId: order.customerId,
    createdAt: new Date(order.createdAt).toISOString(),
    raw: order,
  };
}

export function mapPolarCustomerToCustomer(customer: PolarCustomer): Customer {
  return {
    id: customer.id,
    providerId: "polar",
    externalId: customer.externalId || customer.id,
    email: customer.email,
    name: customer.name || undefined,
    phone: undefined, // Polar doesn't store phone natively yet
    metadata: customer.metadata,
    createdAt: new Date(customer.createdAt).toISOString(),
    deleted: false,
  };
}
