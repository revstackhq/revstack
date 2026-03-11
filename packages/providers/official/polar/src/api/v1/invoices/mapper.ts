import Polar from "polar";
import {
  Invoice,
  InvoiceMapper,
  InvoicePayload,
  InvoiceStatus,
  fromUnixSeconds,
  InvoiceBillingReason,
  normalizeCurrency,
} from "@revstackhq/providers-core";

function mapBillingReason(
  polarReason: Polar.Invoice.BillingReason | string | null | undefined,
): InvoiceBillingReason | undefined {
  switch (polarReason) {
    case "subscription_create":
      return "purchase";
    case "subscription_cycle":
      return "renewal";
    case "subscription_update":
    case "subscription_threshold":
      return "modification";
    case "manual":
      return "manual";
    case "upcoming":
      return "preview";
    default:
      return undefined;
  }
}

export const toInvoice: InvoiceMapper = (raw): Invoice => {
  const invoice = raw as Polar.Invoice;

  const statusMap: Record<string, InvoiceStatus> = {
    draft: "draft",
    open: "open",
    paid: "paid",
    uncollectible: "uncollectible",
    void: "void",
  };

  const taxAmount =
    invoice.total_taxes?.reduce((acc, t) => acc + t.amount, 0) ?? 0;

  const discountAmount =
    invoice.total_discount_amounts?.reduce((acc, d) => acc + d.amount, 0) ?? 0;

  const lineItems =
    invoice.lines?.data?.map((line) => ({
      id: line.id,
      priceId:
        typeof line.pricing?.price_details?.price === "string"
          ? line.pricing.price_details.price
          : undefined,
      productId:
        typeof line.pricing?.price_details?.product === "string"
          ? line.pricing.price_details.product
          : undefined,
      description: line.description ?? "Item",
      quantity: line.quantity ?? 1,
      amountTotal: line.amount,
      amountDiscount:
        line.discount_amounts?.reduce((acc, d) => acc + d.amount, 0) ?? 0,
      amountTax: line.taxes?.reduce((acc, t) => acc + t.amount, 0) ?? 0,
      currency: normalizeCurrency(line.currency, "uppercase"),
    })) ?? [];

  let subscriptionId: string | undefined;

  if (invoice.parent?.type === "subscription_details") {
    const sub = invoice.parent.subscription_details?.subscription;
    subscriptionId = typeof sub === "string" ? sub : (sub?.id ?? undefined);
  }

  let paymentIntentId: string | undefined;

  if (invoice.payments?.data && invoice.payments.data.length > 0) {
    const firstPayment = invoice.payments.data[0] as any;
    const pi =
      firstPayment?.payment_intent ?? firstPayment?.payment?.payment_intent;
    paymentIntentId = typeof pi === "string" ? pi : pi?.id;
  }

  return {
    providerId: "polar",
    id: invoice.id ?? "",
    externalId: invoice.id ?? "",

    customerId:
      typeof invoice.customer === "string"
        ? invoice.customer
        : (invoice.customer?.id ?? ""),

    subscriptionId,
    paymentIntentId,

    status: statusMap[invoice.status ?? "draft"] ?? "draft",

    // ─── TRANSLATED REASON ───
    billingReason: mapBillingReason(invoice.billing_reason),
    invoiceNumber: invoice.number ?? undefined,

    subtotal: invoice.subtotal,
    tax: taxAmount,
    discount: discountAmount,
    total: invoice.total,

    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    // ─── NORMALIZED CURRENCY ───
    currency: normalizeCurrency(invoice.currency, "uppercase"),

    invoicePdfUrl: invoice.invoice_pdf ?? undefined,
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,

    createdAt: fromUnixSeconds(invoice.created),
    dueDate: invoice.due_date ? fromUnixSeconds(invoice.due_date) : undefined,
    finalizedAt: invoice.status_transitions?.finalized_at
      ? fromUnixSeconds(invoice.status_transitions.finalized_at)
      : undefined,
    paidAt: invoice.status_transitions?.paid_at
      ? fromUnixSeconds(invoice.status_transitions.paid_at)
      : undefined,

    metadata: invoice.metadata || {},

    lines: lineItems,

    raw: invoice,
  };
};

export function toInvoicePayload(raw: any): InvoicePayload {
  const mapped = toInvoice(raw);

  return {
    subtotal: mapped.subtotal,
    tax: mapped.tax,
    discount: mapped.discount,
    total: mapped.total,

    amountDue: mapped.amountDue,
    amountPaid: mapped.amountPaid,
    currency: mapped.currency,

    invoiceNumber: mapped.invoiceNumber,
    dueDate: mapped.dueDate,
    billingReason: mapped.billingReason,

    invoicePdfUrl: mapped.invoicePdfUrl,
    hostedInvoiceUrl: mapped.hostedInvoiceUrl,
  };
}
