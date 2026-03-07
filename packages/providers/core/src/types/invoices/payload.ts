import { InvoiceBillingReason } from "@/types/invoices/model";

/**
 * Payload for invoice events, representing the legal billing document.
 */
export interface InvoicePayload {
  /** Total sum of line items before tax (in the smallest currency unit). */
  amountSubtotal: number;
  /** Total tax amount applied. */
  amountTax: number;
  /** Final invoice total. */
  amountTotal: number;
  /** The remaining amount to be collected. */
  amountDue: number;
  /** The amount that has already been collected. */
  amountPaid: number;
  /** Three-letter ISO currency code, in lowercase. */
  currency: string;
  /** Tax rate IDs applied to this specific invoice. */
  appliedTaxRateIds?: string[];
  /** A provider-hosted public URL to download the invoice PDF. */
  invoicePdfUrl?: string;
  /** The business event that triggered this invoice. */
  billingReason?: InvoiceBillingReason;
}
