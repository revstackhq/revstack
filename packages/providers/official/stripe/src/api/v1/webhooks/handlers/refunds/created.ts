import {
  RefundPaymentReason,
  RefundPayload,
  fromUnixSeconds,
  WebhookHandler,
} from "@revstackhq/providers-core";
import { toRefundPayload } from "@/api/v1/refunds/mapper";
import type Stripe from "stripe";

/**
 * Handles a refund creation event.
 * Emitted when a new refund is initiated, before it is processed by the banking network.
 * Maps to: REFUND_CREATED
 */
export const handleRefundCreated: WebhookHandler = async (raw, _ctx) => {
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

  return Promise.resolve({
    type: "REFUND_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: refund.id,
    metadata: { ...refund.metadata },
    originalPayload: raw,
    data,
  });
};
