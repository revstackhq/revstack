import { InvoiceStatus, CollectionMethod } from "@/types/invoices/model";

/**
 * Input parameters for injecting a one-off charge into a pending invoice.
 * Used for overage billing patterns before an invoice is finalized.
 */
export interface AddInvoiceItemInput {
  /** The unique identifier of the customer in the provider's system. */
  customerId: string;
  /** Optional: The specific subscription ID to attach this line item to. */
  subscriptionId?: string;
  /** The total amount to charge in the smallest currency unit (e.g., 1500 for 15.00). */
  amount: number;
  /** The 3-letter ISO currency code (e.g., "usd"). */
  currency: string;
  /** A human-readable description that will appear on the final invoice document. */
  description: string;
  /** Optional key-value pairs for internal tracking and custom logic. */
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Input parameters for retrieving a specific formalized invoice.
 */
export interface GetInvoiceInput {
  /** The provider's unique invoice identifier. */
  id: string;
}

/**
 * Options for paginating through historical invoices.
 */
export interface ListInvoicesOptions {
  /** Filter invoices by a specific customer. */
  customerId?: string;
  /** Filter invoices attached to a specific subscription. */
  subscriptionId?: string;
  /** Filter by the current lifecycle state of the invoice. */
  status?: InvoiceStatus;
  /** The maximum number of invoices to return. */
  limit?: number;
  /** Cursor for pagination (points to the last retrieved resource ID). */
  startingAfter?: string;
  /** Cursor for pagination (points to the first retrieved resource ID). */
  endingBefore?: string;
}

/**
 * Universal abstraction for creating an invoice.
 * Triggers the conversion of pending items into a formalized billing document.
 */
export interface CreateInvoiceInput {
  /** The unique identifier of the customer in the provider's system. */
  customerId: string;
  /** * If provided, the invoice will only include pending items associated with this subscription.
   * Useful for mid-cycle overage billing.
   */
  subscriptionId?: string;
  /** * When true, the provider will attempt to finalize and collect the payment immediately.
   * If false, the invoice remains in a draft state.
   */
  autoAdvance: boolean;
  /** The method used to collect the funds. */
  collectionMethod: CollectionMethod;
  /** A human-readable description for the invoice. */
  description?: string;
  /** * Number of days until the invoice is due.
   * Usually required if collectionMethod is 'send_invoice'.
   */
  daysUntilDue?: number;
  /** Custom key-value pairs for internal tracking. */
  metadata?: Record<string, any>;
}
