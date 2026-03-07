import Stripe from "stripe";
import {
  RefundMapper,
  RefundPayload,
  RefundPaymentReason,
  RefundStatus,
 fromUnixSeconds } from "@revstackhq/providers-core";

/**
 * Maps a raw provider refund object into the unified Revstack Refund entity.
 * Normalizes status, reason, and relational identifiers.
 *
 * @param raw - The raw refund payload from the provider API or a webhook event.
 * @returns A normalized Revstack Refund.
 */
export const toRefund: RefundMapper = (raw) => {
  const refund = raw as Stripe.Refund;

  const statusMap: Record<string, RefundStatus> = {
    pending: "pending",
    succeeded: "succeeded",
    failed: "failed",
    // A canceled reversal is surfaced as failed from the Revstack perspective
    canceled: "failed",
  };

  const reasonMap: Record<string, RefundPaymentReason> = {
    duplicate: "duplicate",
    fraudulent: "fraudulent",
    requested_by_customer: "requested_by_customer",
  };

  return {
    id: refund.id,
    providerId: "stripe",
    externalId: refund.id,
    paymentId:
      typeof refund.payment_intent === "string"
        ? refund.payment_intent
        : (refund.payment_intent?.id ?? ""),
    amount: refund.amount,
    currency: refund.currency,
    status: statusMap[refund.status ?? "pending"] ?? "pending",
    reason: refund.reason ? reasonMap[refund.reason] : undefined,
    description: refund.description ?? undefined,
    createdAt: fromUnixSeconds(refund.created),
    metadata: refund.metadata || {},
    raw: refund,
  };
};

/**
 * Extracts a minimal RefundPayload from a raw provider refund object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw refund object from a webhook event body.
 * @returns A RefundPayload for use in RevstackEvent.data.
 */
export function toRefundPayload(raw: any): RefundPayload {
  const refund = raw as Stripe.Refund;
  return {
    paymentId:
      typeof refund.payment_intent === "string"
        ? refund.payment_intent
        : (refund.payment_intent?.id ?? ""),
    amount: refund.amount,
    currency: refund.currency,
    reason: refund.reason ? (refund.reason as any) : undefined,
    status: refund.status ? (refund.status as any) : "pending",
  };
}
