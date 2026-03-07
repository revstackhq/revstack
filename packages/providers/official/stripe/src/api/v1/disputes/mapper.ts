import Stripe from "stripe";
import {
  DisputeMapper,
  DisputePayload,
  DisputeStatus,
 fromUnixSeconds } from "@revstackhq/providers-core";

/**
 * Maps a raw provider dispute object into the unified Revstack Dispute entity.
 * Normalizes the lifecycle status, evidence deadline, and relational identifiers.
 *
 * @param raw - The raw provider dispute payload.
 * @returns A unified Revstack Dispute.
 */
export const toDispute: DisputeMapper = (raw) => {
  const dispute = raw as Stripe.Dispute;

  const statusMap: Record<string, DisputeStatus> = {
    warning_needs_response: "warning_needs_response",
    warning_under_review: "under_review",
    warning_closed: "lost",
    needs_response: "needs_response",
    under_review: "under_review",
    charge_refunded: "won",
    won: "won",
    lost: "lost",
  };

  return {
    id: dispute.id,
    providerId: "stripe",
    externalId: dispute.id,
    paymentId:
      typeof dispute.payment_intent === "string"
        ? dispute.payment_intent
        : (dispute.payment_intent?.id ?? ""),
    amount: dispute.amount,
    currency: dispute.currency,
    status: statusMap[dispute.status] ?? "needs_response",
    reason: dispute.reason ?? undefined,
    evidenceDueBy: dispute.evidence_details?.due_by
      ? fromUnixSeconds(dispute.evidence_details.due_by)
      : undefined,
    isChargeRefundable: dispute.is_charge_refundable,
    createdAt: fromUnixSeconds(dispute.created),
    metadata: dispute.metadata || {},
    raw: dispute,
  };
};

/**
 * Maps a raw provider dispute status string to the canonical DisputeStatus type.
 */
export function mapDisputeStatus(status: string): DisputeStatus {
  const map: Record<string, DisputeStatus> = {
    warning_needs_response: "warning_needs_response",
    needs_response: "needs_response",
    under_review: "under_review",
    charge_refunded: "won",
    won: "won",
    lost: "lost",
  };
  return map[status] ?? "under_review";
}

/**
 * Extracts a minimal DisputePayload from a raw provider dispute object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw dispute object from a webhook event body.
 * @returns A DisputePayload for use in RevstackEvent.data.
 */
export function toDisputePayload(raw: any): DisputePayload {
  const dispute = raw as Stripe.Dispute;
  return {
    paymentId:
      typeof dispute.payment_intent === "string"
        ? dispute.payment_intent
        : (dispute.payment_intent?.id ?? ""),
    amount: dispute.amount,
    currency: dispute.currency,
    reason: dispute.reason,
    status: mapDisputeStatus(dispute.status),
  };
}
