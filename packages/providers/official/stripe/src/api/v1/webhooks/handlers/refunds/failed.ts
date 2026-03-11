import {
  RefundPayload,
  fromUnixSeconds,
  RefundPaymentReason,
  WebhookHandler,
} from "@revstackhq/providers-core";
import { toRefundPayload } from "@/api/v1/refunds/mapper";
import type Stripe from "stripe";

/**
 * Handles a refund failure event.
 * Emitted when a refund cannot be processed by the banking network.
 * Maps to: REFUND_FAILED
 */
export const handleRefundFailed: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.RefundFailedEvent;
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
    status: "failed",
  };

  return Promise.resolve({
    type: "REFUND_FAILED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: refund.id,
    metadata: { ...refund.metadata },
    originalPayload: raw,
    data,
  });
};
