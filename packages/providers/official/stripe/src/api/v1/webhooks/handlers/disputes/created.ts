import {
  DisputeStatus,
  fromUnixSeconds,
  WebhookHandler,
} from "@revstackhq/providers-core";
import { toDisputePayload } from "@/api/v1/disputes/mapper";
import type Stripe from "stripe";

/**
 * Maps a raw provider dispute status string to the canonical DisputeStatus type.
 * Some provider-specific terminal statuses (e.g., charge refunded) are normalized to 'won'.
 */
export function mapStripeDisputeStatus(status: string): DisputeStatus {
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
 * Handles a dispute creation event.
 * Emitted when a customer initiates a chargeback through their bank.
 * Maps to: DISPUTE_CREATED
 */
export const handleDisputeCreated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.ChargeDisputeCreatedEvent;
  const dispute = event.data.object;

  const data = {
    ...toDisputePayload(dispute),
    status: "needs_response" as DisputeStatus,
  };

  return Promise.resolve({
    type: "DISPUTE_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: dispute.id,
    metadata: { ...dispute.metadata },
    originalPayload: raw,
    data,
  });
};
