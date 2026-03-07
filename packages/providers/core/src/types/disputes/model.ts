/** Current stage of a dispute lifecycle. */
export type DisputeStatus =
  | "warning_needs_response"
  | "needs_response"
  | "under_review"
  | "won"
  | "lost";

/**
 * The Universal Dispute Entity.
 * Represents a chargeback or inquiry raised against a payment by the card network.
 */
export interface Dispute {
  /** Revstack internal dispute ID. */
  id: string;
  /** The provider slug managing this dispute (e.g., 'stripe'). */
  providerId: string;
  /** External provider dispute ID (e.g., Stripe's dp_xxx). */
  externalId: string;
  /** The external payment ID being disputed. */
  paymentId: string;
  /** Amount being disputed, in the smallest currency unit. */
  amount: number;
  /** Three-letter ISO 4217 currency code. */
  currency: string;
  /** Current stage of the dispute lifecycle. */
  status: DisputeStatus;
  /** Reason provided by the card network for the chargeback (e.g., 'fraudulent', 'product_not_received'). */
  reason?: string;
  /** Deadline by which evidence must be submitted to the network. */
  evidenceDueBy?: Date;
  /** Whether the provider has already automatically responded to this dispute. */
  isChargeRefundable: boolean;
  /** Exact timestamp when the dispute was opened. */
  createdAt: Date;
  /** Arbitrary key-value store for custom business logic data. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing. */
  raw?: any;
}
