import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toInvoicePayload } from "@/api/v1/invoices/mapper";

/** Handles an invoice payment failure event. → INVOICE_PAYMENT_FAILED */
export function handleInvoicePaymentFailed(raw: any): RevstackEvent | null {
  const event = raw as Stripe.InvoicePaymentFailedEvent;
  const invoice = event.data.object;
  return {
    type: "INVOICE_PAYMENT_FAILED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: invoice.id,
    customerId:
      typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer?.id,
    metadata: { ...invoice.metadata },
    originalPayload: raw,
    data: toInvoicePayload(invoice),
  };
}
