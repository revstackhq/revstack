import Stripe from "stripe";
import {
  CheckoutSessionMapper,
  CheckoutPayload,
  CheckoutSessionMode,
  CheckoutPaymentStatus,
  CheckoutStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Maps a raw provider checkout session object into the unified Revstack CheckoutSession entity.
 * Normalizes lifecycle status, payment status, and all relational identifiers.
 *
 * @param raw - The raw checkout session returned from the provider.
 * @returns A canonical Revstack `CheckoutSession`.
 */
export const toCheckoutSession: CheckoutSessionMapper = (raw) => {
  const session = raw as Stripe.Checkout.Session;

  const statusMap: Record<string, CheckoutStatus> = {
    open: "open",
    complete: "complete",
    expired: "expired",
  };

  const paymentStatusMap: Record<string, CheckoutPaymentStatus> = {
    paid: "paid",
    unpaid: "unpaid",
    no_payment_required: "no_payment_required",
  };

  return {
    id: session.id,
    providerId: "stripe",
    externalId: session.id,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id,
    mode: session.mode as CheckoutSessionMode,
    status: statusMap[session.status ?? "open"] ?? "open",
    paymentStatus:
      paymentStatusMap[session.payment_status ?? "unpaid"] ?? "unpaid",
    successUrl: session.success_url ?? undefined,
    cancelUrl: session.cancel_url ?? undefined,
    url: session.url ?? undefined,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
    subscriptionId:
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id,
    clientReferenceId: session.client_reference_id ?? undefined,
    amountTotal: session.amount_total ?? undefined,
    currency: session.currency ?? undefined,
    expiresAt: fromUnixSeconds(session.expires_at),
    createdAt: fromUnixSeconds(session.created),
    metadata: session.metadata || {},
    raw: session,
  };
};

/**
 * Normalizes a raw provider checkout mode string to the canonical CheckoutSessionMode type.
 */
export function normalizeCheckoutMode(
  mode: string | null | undefined,
): CheckoutSessionMode {
  return (mode ?? "payment") as CheckoutSessionMode;
}

/**
 * Normalizes a raw provider payment status string to the canonical CheckoutPaymentStatus type.
 */
export function normalizeCheckoutPaymentStatus(
  status: string | null | undefined,
): CheckoutPaymentStatus {
  const map: Record<string, CheckoutPaymentStatus> = {
    paid: "paid",
    unpaid: "unpaid",
    no_payment_required: "no_payment_required",
  };
  return map[status ?? ""] ?? "unpaid";
}

/**
 * Extracts a minimal CheckoutPayload from a raw provider checkout session object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw checkout session object from a webhook event body.
 * @returns A CheckoutPayload for use in RevstackEvent.data.
 */
export function toCheckoutPayload(raw: any): CheckoutPayload {
  const session = raw as Stripe.Checkout.Session;
  return {
    amountSubtotal: session.amount_subtotal ?? 0,
    amountTax: session.total_details?.amount_tax ?? 0,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    appliedDiscountIds: (session.discounts ?? [])
      .map((d: any) => d.coupon ?? d.promotion_code)
      .filter(Boolean),
    mode: normalizeCheckoutMode(session.mode),
    paymentStatus: normalizeCheckoutPaymentStatus(session.payment_status),
  };
}

/**
 * Builds a lightweight checkout result DTO for use in the createCheckoutSession API response.
 * This is a redirect handshake DTO — it carries only the hosted page identifier and its
 * expiry, not the full session entity. Use `toCheckoutSession` for a complete record.
 *
 * @param session - The raw provider checkout session object.
 * @returns A minimal CheckoutSessionResult.
 */
export function toCheckoutResult(session: Stripe.Checkout.Session) {
  return {
    id: session.id,
    expiresAt: session.expires_at
      ? fromUnixSeconds(session.expires_at)
      : undefined,
  };
}
