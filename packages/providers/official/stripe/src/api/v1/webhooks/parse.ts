import {
  RevstackEvent,
  AsyncActionResult,
  RevstackErrorCode,
  WebhookEventHandler,
} from "@revstackhq/providers-core";
import Stripe from "stripe";

// ─── Payments ────────────────────────────────────────────────────────────────
import { handlePaymentCreated } from "@/api/v1/webhooks/handlers/payments/created";
import { handlePaymentAuthorized } from "@/api/v1/webhooks/handlers/payments/authorized";
import { handlePaymentProcessing } from "@/api/v1/webhooks/handlers/payments/processing";
import { handlePaymentSucceeded } from "@/api/v1/webhooks/handlers/payments/succeeded";
import { handlePaymentFailed } from "@/api/v1/webhooks/handlers/payments/failed";
import { handlePaymentCanceled } from "@/api/v1/webhooks/handlers/payments/canceled";

// ─── Refunds ─────────────────────────────────────────────────────────────────
import { handleRefundCreated } from "@/api/v1/webhooks/handlers/refunds/created";
import { handleRefundProcessed } from "@/api/v1/webhooks/handlers/refunds/processed";
import { handleRefundFailed } from "@/api/v1/webhooks/handlers/refunds/failed";

// ─── Disputes ────────────────────────────────────────────────────────────────
import { handleDisputeCreated } from "@/api/v1/webhooks/handlers/disputes/created";
import { handleDisputeUpdated } from "@/api/v1/webhooks/handlers/disputes/updated";
import { handleDisputeClosed } from "@/api/v1/webhooks/handlers/disputes/closed";

// ─── Checkouts ───────────────────────────────────────────────────────────────
import { handleCheckoutCompleted } from "@/api/v1/webhooks/handlers/checkouts/completed";
import { handleCheckoutExpired } from "@/api/v1/webhooks/handlers/checkouts/expired";
import { handleCheckoutCanceled } from "@/api/v1/webhooks/handlers/checkouts/canceled";

// ─── Subscriptions ───────────────────────────────────────────────────────────
import { handleSubscriptionCreated } from "@/api/v1/webhooks/handlers/subscriptions/created";
import { handleSubscriptionUpdated } from "@/api/v1/webhooks/handlers/subscriptions/updated";
import { handleSubscriptionRevoked } from "@/api/v1/webhooks/handlers/subscriptions/revoked";
import { handleSubscriptionPaused } from "@/api/v1/webhooks/handlers/subscriptions/paused";
import { handleSubscriptionResumed } from "@/api/v1/webhooks/handlers/subscriptions/resumed";
import { handleSubscriptionTrialWillEnd } from "@/api/v1/webhooks/handlers/subscriptions/trial-will-end";

// ─── Invoices ─────────────────────────────────────────────────────────────────
import { handleInvoiceCreated } from "@/api/v1/webhooks/handlers/invoices/created";
import { handleInvoiceFinalized } from "@/api/v1/webhooks/handlers/invoices/finalized";
import { handleInvoicePaid } from "@/api/v1/webhooks/handlers/invoices/paid";
import { handleInvoicePaymentFailed } from "@/api/v1/webhooks/handlers/invoices/payment-failed";
import { handleInvoiceVoided } from "@/api/v1/webhooks/handlers/invoices/voided";
import { handleInvoiceUncollectible } from "@/api/v1/webhooks/handlers/invoices/uncollectible";

// ─── Customers ────────────────────────────────────────────────────────────────
import { handleCustomerCreated } from "@/api/v1/webhooks/handlers/customers/created";
import { handleCustomerUpdated } from "@/api/v1/webhooks/handlers/customers/updated";
import { handleCustomerDeleted } from "@/api/v1/webhooks/handlers/customers/deleted";

// ─── Payment Methods ──────────────────────────────────────────────────────────
import { handlePaymentMethodAttached } from "@/api/v1/webhooks/handlers/paymentMethods/attached";
import { handlePaymentMethodUpdated } from "@/api/v1/webhooks/handlers/paymentMethods/updated";
import { handlePaymentMethodDetached } from "@/api/v1/webhooks/handlers/paymentMethods/detached";

// ─── Mandates ─────────────────────────────────────────────────────────────────
import { handleMandateUpdated } from "@/api/v1/webhooks/handlers/mandates/updated";

// ─── Products ─────────────────────────────────────────────────────────────────
import { handleProductCreated } from "@/api/v1/webhooks/handlers/products/created";
import { handleProductUpdated } from "@/api/v1/webhooks/handlers/products/updated";
import { handleProductDeleted } from "@/api/v1/webhooks/handlers/products/deleted";

// ─── Prices ───────────────────────────────────────────────────────────────────
import { handlePriceCreated } from "@/api/v1/webhooks/handlers/prices/created";
import { handlePriceUpdated } from "@/api/v1/webhooks/handlers/prices/updated";
import { handlePriceDeleted } from "@/api/v1/webhooks/handlers/prices/deleted";

/**
 * Resolves the primary resource ID from a raw provider event object.
 * Used to populate `resourceId` on RevstackEvent without coupling callers to the raw shape.
 */
export function extractResourceId(event: Stripe.Event): string | null {
  const obj = event.data.object as any;
  if (event.type.startsWith("customer.subscription")) return obj.id;
  if (event.type.startsWith("payment_intent")) return obj.id;
  if (event.type === "checkout.session.completed") return obj.id;
  if (event.type.startsWith("charge.dispute"))
    return obj.payment_intent || obj.charge;
  return obj.id || null;
}

/**
 * The Webhook Dispatcher Registry.
 * Maps the raw provider event type to its corresponding isolated handler function.
 */
export const HANDLER_REGISTRY: Record<string, WebhookEventHandler> = {
  // ── Payments ────────────────────────────────────────────────────────────
  "payment_intent.created": handlePaymentCreated,
  "payment_intent.amount_capturable_updated": handlePaymentAuthorized,
  "payment_intent.processing": handlePaymentProcessing,
  "payment_intent.succeeded": handlePaymentSucceeded,
  "payment_intent.payment_failed": handlePaymentFailed,
  "payment_intent.canceled": handlePaymentCanceled,

  // ── Refunds ─────────────────────────────────────────────────────────────
  "refund.created": handleRefundCreated,
  "charge.refunded": handleRefundProcessed,
  "refund.failed": handleRefundFailed,

  // ── Disputes ────────────────────────────────────────────────────────────
  "charge.dispute.created": handleDisputeCreated,
  "charge.dispute.updated": handleDisputeUpdated,
  "charge.dispute.closed": handleDisputeClosed,

  // ── Checkouts ───────────────────────────────────────────────────────────
  "checkout.session.completed": handleCheckoutCompleted,
  "checkout.session.expired": handleCheckoutExpired,
  "checkout.session.async_payment_failed": handleCheckoutCanceled,

  // ── Subscriptions ───────────────────────────────────────────────────────
  "customer.subscription.created": handleSubscriptionCreated,
  "customer.subscription.updated": handleSubscriptionUpdated,
  "customer.subscription.deleted": handleSubscriptionRevoked,
  "customer.subscription.paused": handleSubscriptionPaused,
  "customer.subscription.resumed": handleSubscriptionResumed,
  "customer.subscription.trial_will_end": handleSubscriptionTrialWillEnd,

  // ── Invoices ────────────────────────────────────────────────────────────
  "invoice.created": handleInvoiceCreated,
  "invoice.finalized": handleInvoiceFinalized,
  "invoice.paid": handleInvoicePaid,
  "invoice.payment_failed": handleInvoicePaymentFailed,
  "invoice.voided": handleInvoiceVoided,
  "invoice.marked_uncollectible": handleInvoiceUncollectible,

  // ── Customers ───────────────────────────────────────────────────────────
  "customer.created": handleCustomerCreated,
  "customer.updated": handleCustomerUpdated,
  "customer.deleted": handleCustomerDeleted,

  // ── Payment Methods ─────────────────────────────────────────────────────
  "payment_method.attached": handlePaymentMethodAttached,
  "payment_method.updated": handlePaymentMethodUpdated,
  "payment_method.detached": handlePaymentMethodDetached,

  // ── Mandates ────────────────────────────────────────────────────────────
  "mandate.updated": handleMandateUpdated,

  // ── Catalog ─────────────────────────────────────────────────────────────
  "product.created": handleProductCreated,
  "product.updated": handleProductUpdated,
  "product.deleted": handleProductDeleted,
  "price.created": handlePriceCreated,
  "price.updated": handlePriceUpdated,
  "price.deleted": handlePriceDeleted,
};

/**
 * Parses and dispatches an incoming webhook payload to the appropriate domain handler.
 * Returns the normalized RevstackEvent, or null if the event type is unmapped (ignored).
 *
 * @param payload - The raw JSON payload from the provider's webhook request.
 * @returns An AsyncActionResult containing the normalized RevstackEvent, or null if ignored.
 */
export const parseWebhookEvent = async (
  payload: any,
): Promise<AsyncActionResult<RevstackEvent | null>> => {
  if (!payload || !payload.type) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.InvalidWebhookPayload,
        message: "Missing payload type",
      },
    };
  }

  const handler = HANDLER_REGISTRY[payload.type];

  if (!handler) {
    console.log(`[Revstack] Ignored unmapped provider event: ${payload.type}`);
    return { data: null, status: "success" };
  }

  try {
    const revstackEvent = handler(payload);

    if (!revstackEvent) {
      console.log(
        `[Revstack] Handler explicitly skipped processing for event: ${payload.type}`,
      );
      return { data: null, status: "success" };
    }

    return { data: revstackEvent, status: "success" };
  } catch (error) {
    console.error(`[Revstack] Error parsing webhook ${payload.type}:`, error);
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.InvalidWebhookPayload,
        message: (error as Error).message,
      },
    };
  }
};
