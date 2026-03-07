import {
  RevstackEvent,
  RefundPaymentReason,
  RefundPayload,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import { toRefundPayload } from "@/api/v1/refunds/mapper";
import type Stripe from "stripe";

/**
 * Handles a refund creation event.
 * Emitted when a new refund is initiated, before it is processed by the banking network.
 * Maps to: REFUND_CREATED
 */
export function handleRefundCreated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.RefundCreatedEvent;
  const refund = event.data.object;

  const KNOWN_REASONS = new Set([
    "duplicate",
    "fraudulent",
    "requested_by_customer",
  ]);

  const data: RefundPayload = {
    ...toRefundPayload(refund),
    reason:
      refund.reason && KNOWN_REASONS.has(refund.reason)
        ? (refund.reason as RefundPaymentReason)
        : undefined,
    status: "pending",
  };

  return {
    type: "REFUND_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: refund.id,
    metadata: { ...refund.metadata },
    originalPayload: raw,
    data,
  };
}
