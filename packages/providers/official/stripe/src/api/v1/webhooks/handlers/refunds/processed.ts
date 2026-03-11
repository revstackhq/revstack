import {
  RefundPaymentReason,
  RefundPayload,
  fromUnixSeconds,
  WebhookHandler,
} from "@revstackhq/providers-core";
import { toRefundPayload } from "@/api/v1/refunds/mapper";
import type Stripe from "stripe";

/**
 * Handles a refund settlement event.
 * Emitted when the banking network confirms a refund has been credited to the customer.
 * Maps to: REFUND_PROCESSED
 */
export const handleRefundProcessed: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.ChargeRefundedEvent;
  const charge = event.data.object;
  const lastRefund = charge.refunds?.data?.[0];

  const KNOWN_REASONS: Set<string> = new Set([
    "duplicate",
    "fraudulent",
    "requested_by_customer",
  ]);

  const data: RefundPayload = {
    ...toRefundPayload(lastRefund!),
    reason:
      lastRefund?.reason && KNOWN_REASONS.has(lastRefund.reason)
        ? (lastRefund.reason as RefundPaymentReason)
        : undefined,
    status: "succeeded",
  };

  return Promise.resolve({
    type: "REFUND_PROCESSED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: lastRefund?.id ?? charge.id,
    customerId:
      typeof charge.customer === "string"
        ? charge.customer
        : charge.customer?.id,
    metadata: { ...charge.metadata },
    originalPayload: raw,
    data,
  });
};
