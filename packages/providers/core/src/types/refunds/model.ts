/**
 * Reason for initiating a refund.
 * Mirrors the provider-standard values supported by most payment processors.
 */
export type RefundPaymentReason =
  | "duplicate"
  | "fraudulent"
  | "requested_by_customer";

/** Status of a refund as reported by the banking network. */
export type RefundStatus = "pending" | "succeeded" | "failed";

/**
 * The Universal Refund Entity.
 * Represents a full or partial reversal of a captured payment.
 */
export interface Refund {
  /** Revstack internal refund ID. */
  id: string;
  /** The provider slug that processed this refund (e.g., 'stripe'). */
  providerId: string;
  /** External provider refund ID (e.g., Stripe's re_xxx). */
  externalId: string;
  /** The external payment ID this refund is associated with. */
  paymentId: string;
  /** Amount refunded, in the smallest currency unit. */
  amount: number;
  /** Three-letter ISO 4217 currency code. */
  currency: string;
  /** Current status of the refund. */
  status: RefundStatus;
  /** The reason for issuing this refund. */
  reason?: RefundPaymentReason;
  /** Human-readable description or notes about the refund. */
  description?: string;
  /** Exact timestamp when the refund was created. */
  createdAt: Date;
  /** Arbitrary key-value store for custom business logic data. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing. */
  raw?: any;
}
