import {
  RevstackEvent,
  DisputeStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import { toDisputePayload } from "@/api/v1/disputes/mapper";
import type Stripe from "stripe";

/**
 * Handles a dispute resolution event.
 * Emitted when a dispute reaches a terminal outcome.
 * Routes to: DISPUTE_WON or DISPUTE_LOST based on the final outcome.
 */
export function handleDisputeClosed(raw: any): RevstackEvent | null {
  const event = raw as Stripe.ChargeDisputeClosedEvent;
  const dispute = event.data.object;

  const isWon = dispute.status === "won";
  const status: DisputeStatus = isWon ? "won" : "lost";

  const data = {
    ...toDisputePayload(dispute),
    status,
  };

  return {
    type: isWon ? "DISPUTE_WON" : "DISPUTE_LOST",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: dispute.id,
    metadata: { ...dispute.metadata },
    originalPayload: raw,
    data,
  };
}
