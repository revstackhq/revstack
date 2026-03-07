import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toDisputePayload } from "@/api/v1/disputes/mapper";
import type Stripe from "stripe";
import { mapStripeDisputeStatus } from "./created";

/**
 * Handles a dispute status change event.
 * Emitted when a dispute advances to a new stage in the review lifecycle.
 * Maps to: DISPUTE_UPDATED
 */
export function handleDisputeUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.ChargeDisputeUpdatedEvent;
  const dispute = event.data.object;

  const data = {
    ...toDisputePayload(dispute),
    status: mapStripeDisputeStatus(dispute.status),
  };

  return {
    type: "DISPUTE_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: dispute.id,
    metadata: { ...dispute.metadata },
    originalPayload: raw,
    data,
  };
}
