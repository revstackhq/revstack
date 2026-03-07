import Stripe from "stripe";
import {
  InvoiceMapper,
  InvoicePayload,
  InvoiceStatus,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Maps a raw provider invoice object into the unified Revstack Invoice entity.
 * Focuses strictly on financial truth: how much was charged, how much was paid.
 *
 * @param raw - The raw provider invoice payload.
 * @returns A unified Revstack Invoice.
 */
export const toInvoice: InvoiceMapper = (raw) => {
  const invoice = raw as Stripe.Invoice;

  const statusMap: Record<string, InvoiceStatus> = {
    draft: "draft",
    open: "open",
    paid: "paid",
    uncollectible: "uncollectible",
    void: "void",
  };

  const taxAmount = (invoice as any).tax ?? 0;

  return {
    providerId: "stripe",
    id: invoice.id ?? "",
    externalId: invoice.id ?? "",
    customerId:
      typeof invoice.customer === "string"
        ? invoice.customer
        : (invoice.customer?.id ?? ""),

    status: statusMap[invoice.status ?? "draft"] ?? "draft",

    subtotal: invoice.subtotal,
    tax: taxAmount,
    total: invoice.total,

    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency.toUpperCase(),

    invoicePdfUrl: invoice.invoice_pdf ?? undefined,

    createdAt: fromUnixSeconds(invoice.created),
    finalizedAt: invoice.status_transitions?.finalized_at
      ? fromUnixSeconds(invoice.status_transitions.finalized_at)
      : undefined,

    metadata: invoice.metadata || {},
    raw: invoice,
  };
};

/**
 * Extracts a minimal InvoicePayload from a raw provider invoice object.
 */
export function toInvoicePayload(raw: any): InvoicePayload {
  const mapped = toInvoice(raw);

  return {
    amountSubtotal: mapped.subtotal,
    amountTax: mapped.tax,
    amountTotal: mapped.total,
    amountDue: mapped.amountDue,
    amountPaid: mapped.amountPaid,
    currency: mapped.currency,
    invoicePdfUrl: mapped.invoicePdfUrl,
  };
}
