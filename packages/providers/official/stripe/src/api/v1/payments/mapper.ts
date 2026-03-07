import Stripe from "stripe";
import {
  PaymentMapper,
  PaymentPayload,
  PaymentStatus,
  normalizeCurrency,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Translates a raw provider payment status string into the canonical Revstack PaymentStatus.
 *
 * @param status - The raw status string from the provider.
 * @returns The standardized PaymentStatus enum value.
 */
function mapProviderStatus(status: Stripe.PaymentIntent.Status): PaymentStatus {
  const statusMap: Record<Stripe.PaymentIntent.Status, PaymentStatus> = {
    succeeded: PaymentStatus.Succeeded,
    requires_payment_method: PaymentStatus.Pending,
    requires_confirmation: PaymentStatus.Pending,
    requires_action: PaymentStatus.RequiresAction,
    canceled: PaymentStatus.Canceled,
    processing: PaymentStatus.Processing,
    requires_capture: PaymentStatus.Authorized,
  };

  return statusMap[status] ?? PaymentStatus.Pending;
}

/**
 * Maps a raw provider payment object into the unified Revstack Payment entity.
 * Extracts and normalizes amounts, lifecycle status, and relational identifiers.
 *
 * @param raw - The raw platform payment object (PaymentIntent | Charge).
 * @returns A unified Revstack Payment.
 */
export const toPayment: PaymentMapper = (raw) => {
  const rawObject = raw as Stripe.PaymentIntent | Stripe.Charge;

  // Decide if we're dealing with a Charge or a PI directly
  const pi = (
    "object" in rawObject && rawObject.object === "charge"
      ? (rawObject as Stripe.Charge).payment_intent
      : rawObject
  ) as Stripe.PaymentIntent;

  let amountRefunded = 0;
  if (pi.latest_charge && typeof pi.latest_charge === "object") {
    amountRefunded = (pi.latest_charge as Stripe.Charge).amount_refunded || 0;
  }

  const hasMetadata = pi.metadata && Object.keys(pi.metadata).length > 0;

  return {
    id: pi.id,
    providerId: "stripe",
    externalId: pi.id,
    amount: pi.amount,
    amountRefunded,
    currency: normalizeCurrency(pi.currency, "uppercase"),
    status: mapProviderStatus(pi.status),
    customerId: typeof pi.customer === "string" ? pi.customer : pi.customer?.id,
    createdAt: fromUnixSeconds(pi.created),
    metadata: hasMetadata ? pi.metadata : undefined,
    raw: pi,
  };
};

/**
 * Extracts a minimal PaymentPayload from a raw provider payment object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw payment object from a webhook event body.
 * @returns A PaymentPayload for use in RevstackEvent.data.
 */
export function toPaymentPayload(raw: any): PaymentPayload {
  const rawObject = raw as Stripe.PaymentIntent | Stripe.Charge;

  const pi = (
    "object" in rawObject && rawObject.object === "charge"
      ? (rawObject as Stripe.Charge).payment_intent
      : rawObject
  ) as Stripe.PaymentIntent;

  const charge = rawObject as Stripe.Charge;
  const isCharge = "object" in rawObject && rawObject.object === "charge";

  return {
    amountSubtotal: isCharge ? charge.amount : pi.amount,
    amountTax: 0,
    amountTotal: isCharge ? charge.amount : pi.amount,
    currency: isCharge ? charge.currency : pi.currency,
    paymentMethodId: isCharge
      ? (charge.payment_method as string | undefined)
      : (pi.payment_method as string | undefined),
    failureReason: isCharge
      ? (charge.failure_message ?? undefined)
      : (pi.last_payment_error?.message ?? undefined),
  };
}
