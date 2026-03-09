/**
 * The business event or action that triggered the generation of this invoice.
 * Maps provider-specific reasons to universal billing concepts.
 */
export type InvoiceBillingReason =
  /** Generated from the initial purchase of a product or start of a new subscription. */
  | "purchase"
  /** Generated automatically at the end of a billing period to renew an active subscription. */
  | "renewal"
  /** Generated mid-cycle due to an upgrade, downgrade, or change in terms (e.g., prorations). */
  | "modification"
  /** Created manually by a merchant or admin, totally decoupled from automated systems. */
  | "manual"
  /** A simulated or projected invoice for upcoming charges (not yet legally binding or finalized). */
  | "preview";

/**
 * The universal lifecycle state of an invoice.
 * Follows standard accounting principles for Accounts Receivable (AR).
 */
export type InvoiceStatus =
  /** The invoice is still being built and can be edited. It has no legal or financial impact yet. */
  | "draft"
  /** The invoice has been finalized and issued. It represents a legal debt awaiting payment. */
  | "open"
  /** The invoice has been successfully collected and fully settled. */
  | "paid"
  /** The invoice is deemed unpayable (bad debt) after exhausting all retry and dunning attempts. */
  | "uncollectible"
  /** The invoice was canceled by the merchant before payment. It is nullified for accounting purposes. */
  | "void";

/**
 * The strategy the billing engine will use to collect the funds for an invoice.
 */
export type CollectionMethod =
  /**
   * The system automatically pulls funds from the customer's saved payment method (e.g., auto-charging a credit card).
   */
  | "automatic"
  /**
   * The system waits for the customer to push funds. Used for standard B2B invoicing (e.g., Net 30 terms, wire transfers, or paying via a hosted link).
   */
  | "manual";

/**
 * Represents a single line item within an invoice.
 */
export interface InvoiceLineItem {
  /** Unique identifier for the line item. */
  id: string;
  /** The associated price identifier. */
  priceId?: string;
  /** The associated product identifier. */
  productId?: string;
  /** Human-readable description (e.g., "Premium Plan - March"). */
  description: string;
  /** Multiplier for the unit price. */
  quantity: number;
  /** Total amount for this line after quantity, before invoice-level discounts/taxes. */
  amountTotal: number;
  /** Total discount applied specifically to this line. */
  amountDiscount: number;
  /** Total tax applied specifically to this line. */
  amountTax: number;
  /** Currency of the line item. */
  currency: string;
}

/**
 * The Universal Invoice Entity.
 * Represents a billing document issued to a customer for payments or renewals.
 */
export interface Invoice {
  /** Unique identifier for the invoice in the provider's system. */
  id: string;
  /** The provider slug (e.g., 'stripe', 'paypal'). */
  providerId: string;
  /** The original provider-specific identifier. */
  externalId: string;

  // ─── RELATIONS ────────────────────────────────────────────────────────
  /** The internal customer identifier. */
  customerId: string;
  /** The associated subscription identifier, if applicable. */
  subscriptionId?: string;
  /** The associated payment transaction identifier. */
  paymentIntentId?: string;

  // ─── LIFECYCLE & METADATA ─────────────────────────────────────────────
  /** Current status of the invoice. */
  status: InvoiceStatus;
  /** The business event that triggered this invoice. */
  billingReason?: InvoiceBillingReason;
  /** The formatted sequential invoice number (e.g., INV-2026-001). */
  invoiceNumber?: string;

  // ─── FINANCIAL TOTALS ─────────────────────────────────────────────────
  /** Total amount before tax and discounts. */
  subtotal: number;
  /** Total discount amount applied to the entire invoice. */
  discount: number;
  /** Total tax amount applied to the entire invoice. */
  tax: number;
  /** Final calculated total (subtotal - discount + tax). */
  total: number;
  /** The remaining amount that needs to be collected. */
  amountDue: number;
  /** The amount that has already been successfully paid. */
  amountPaid: number;
  /** Three-letter ISO 4217 currency code. */
  currency: string;

  // ─── LINE ITEMS ───────────────────────────────────────────────────────
  /** Detailed breakdown of charges. */
  lines: InvoiceLineItem[];

  // ─── ASSETS & URLS ────────────────────────────────────────────────────
  /** URL to download the invoice in PDF format. */
  invoicePdfUrl?: string;
  /** Public URL where the customer can view and pay the invoice online. */
  hostedInvoiceUrl?: string;

  // ─── TIMESTAMPS ───────────────────────────────────────────────────────
  /** When the invoice was first created. */
  createdAt: Date;
  /** When the invoice is due to be paid. */
  dueDate?: Date;
  /** When the invoice was finalized and issued. */
  finalizedAt?: Date;
  /** When the invoice was fully paid. */
  paidAt?: Date;

  /** Metadata for custom business logic. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing and debugging. */
  raw?: any;
}
