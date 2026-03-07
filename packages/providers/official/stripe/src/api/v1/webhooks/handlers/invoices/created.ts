import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toInvoicePayload } from "@/api/v1/invoices/mapper";

/** Handles an invoice creation event. → INVOICE_CREATED */
export function handleInvoiceCreated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.InvoiceCreatedEvent;
  const invoice = event.data.object;
  return {
    type: "INVOICE_CREATED",
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
