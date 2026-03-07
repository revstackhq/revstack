/** Business event that triggered the generation of an invoice. */
export type InvoiceBillingReason =
  | "subscription_create"
  | "subscription_cycle"
  | "subscription_update"
  | "manual";

/** Lifecycle status of a billing invoice. */
export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "uncollectible"
  | "void";

/**
 * The Universal Invoice Entity.
 * Represents a billing document issued to a customer for a payment or subscription renewal.
 */
export interface Invoice {
  /** Provider invoice ID. */
  id: string;
  /** The provider slug that generated this invoice (e.g., 'stripe'). */
  providerId: string;
  /** External provider invoice ID (e.g., Stripe's in_xxx). */
  externalId: string;
  /** The internal customer ID this invoice belongs to. */
  customerId: string;
  /** Current status of the invoice. */
  status: InvoiceStatus;
  /** Total amount due before tax, in the smallest currency unit. */
  subtotal: number;
  /** Total tax applied, in the smallest currency unit. */
  tax: number;
  /** Total amount due (subtotal + tax - discounts), in the smallest currency unit. */
  total: number;
  /** Amount due for immediate payment. */
  amountDue: number;
  /** Amount already paid against this invoice. */
  amountPaid: number;
  /** Three-letter ISO 4217 currency code. */
  currency: string;
  /** URL to the hosted invoice PDF, if available. */
  invoicePdfUrl?: string;
  /** Exact timestamp when the invoice was created. */
  createdAt: Date;
  /** Exact timestamp when the invoice was finalized and sent to the customer. */
  finalizedAt?: Date;
  /** Arbitrary key-value store for custom business logic data. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing. */
  raw?: any;
}
