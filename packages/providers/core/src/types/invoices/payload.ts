import { InvoiceBillingReason } from "@/types/invoices/model";

export interface InvoicePayload {
  /** Total sum before tax and discounts. */
  subtotal: number;
  /** Total discount amount applied. */
  discount: number;
  /** Total tax amount applied. */
  tax: number;
  /** Final total amount (subtotal - discount + tax). */
  total: number;

  /** The remaining balance to be collected. */
  amountDue: number;
  /** The amount that has already been successfully paid. */
  amountPaid: number;
  /** Three-letter ISO 4217 currency code. */
  currency: string;

  /** The formatted sequential invoice number (e.g., INV-2026-001). */
  invoiceNumber?: string;
  /** The date when payment is due. */
  dueDate?: Date;
  /** The business event that triggered this invoice. */
  billingReason?: InvoiceBillingReason;

  /** URL to download the invoice in PDF format. */
  invoicePdfUrl?: string;
  /** Public URL where the customer can view and pay the invoice online. */
  hostedInvoiceUrl?: string;
}
