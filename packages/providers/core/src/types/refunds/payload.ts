import { RefundPaymentReason, RefundStatus } from "@/types/refunds/model";

/**
 * Payload for events related to money refunds.
 */
export interface RefundPayload {
  /** The ID of the original payment being refunded. */
  paymentId: string;
  /** The amount being refunded (in the smallest currency unit, e.g., cents). */
  amount: number;
  /** Three-letter ISO currency code, in lowercase. */
  currency: string;
  /** The reason for the refund. */
  reason?: RefundPaymentReason;
  /** The current status of the refund in the banking network. */
  status: RefundStatus;
}
