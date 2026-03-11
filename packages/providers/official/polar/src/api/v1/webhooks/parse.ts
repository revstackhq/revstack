import {
  RevstackEvent,
  AsyncActionResult,
  RevstackErrorCode,
  ProviderContext,
  WebhookHandler,
} from "@revstackhq/providers-core";

// ─── Checkouts ───────────────────────────────────────────────────────────────
import { handleCheckoutCompleted } from "@/api/v1/webhooks/handlers/checkouts/completed";
import { handleCheckoutUpdated } from "@/api/v1/webhooks/handlers/checkouts/updated";

// ─── Subscriptions ───────────────────────────────────────────────────────────
import { handleSubscriptionCreated } from "@/api/v1/webhooks/handlers/subscriptions/created";
import { handleSubscriptionUpdated } from "@/api/v1/webhooks/handlers/subscriptions/updated";
import { handleSubscriptionCanceled } from "@/api/v1/webhooks/handlers/subscriptions/canceled";
import { handleSubscriptionActive } from "@/api/v1/webhooks/handlers/subscriptions/active";
import { handleSubscriptionUncanceled } from "@/api/v1/webhooks/handlers/subscriptions/uncanceled";
import { handleSubscriptionRevoked } from "@/api/v1/webhooks/handlers/subscriptions/revoked";
import { handleSubscriptionPastDue } from "@/api/v1/webhooks/handlers/subscriptions/past_due";

// ─── Orders ──────────────────────────────────────────────────────────────────
import { handleOrderCreated } from "@/api/v1/webhooks/handlers/orders/created";
import { handleOrderUpdated } from "@/api/v1/webhooks/handlers/orders/updated";
import { handleOrderPaid } from "@/api/v1/webhooks/handlers/orders/paid";
import { handleOrderRefunded } from "@/api/v1/webhooks/handlers/orders/refunded";

// ─── Customers ───────────────────────────────────────────────────────────────
import { handleCustomerCreated } from "@/api/v1/webhooks/handlers/customers/created";
import { handleCustomerUpdated } from "@/api/v1/webhooks/handlers/customers/updated";
import { handleCustomerDeleted } from "@/api/v1/webhooks/handlers/customers/deleted";
import { handleCustomerStateChanged } from "@/api/v1/webhooks/handlers/customers/state_changed";

// ─── Refunds ─────────────────────────────────────────────────────────────────
import { handleRefundCreated } from "@/api/v1/webhooks/handlers/refunds/created";
import { handleRefundUpdated } from "@/api/v1/webhooks/handlers/refunds/updated";

/**
 * Resolves the primary resource ID from a raw provider event object.
 * Used to populate `resourceId` on RevstackEvent without coupling callers to the raw shape.
 */
export function extractResourceId(payload: any): string | null {
  const data = payload.data;
  if (!data) return null;
  return data.id || null;
}

/**
 * The Webhook Dispatcher Registry.
 * Maps the raw provider event type to its corresponding isolated handler function.
 */
export const HANDLER_REGISTRY: Record<string, WebhookHandler> = {
  // ── Checkouts ───────────────────────────────────────────────────────────
  "checkout.created": handleCheckoutCompleted,
  "checkout.updated": handleCheckoutUpdated,

  // ── Subscriptions ───────────────────────────────────────────────────────
  "subscription.created": handleSubscriptionCreated,
  "subscription.updated": handleSubscriptionUpdated,
  "subscription.canceled": handleSubscriptionCanceled,
  "subscription.active": handleSubscriptionActive,
  "subscription.uncanceled": handleSubscriptionUncanceled,
  "subscription.revoked": handleSubscriptionRevoked,
  "subscription.past_due": handleSubscriptionPastDue,

  // ── Orders ──────────────────────────────────────────────────────────────
  "order.created": handleOrderCreated,
  "order.updated": handleOrderUpdated,
  "order.paid": handleOrderPaid,
  "order.refunded": handleOrderRefunded,

  // ── Customers ───────────────────────────────────────────────────────────
  "customer.created": handleCustomerCreated,
  "customer.updated": handleCustomerUpdated,
  "customer.deleted": handleCustomerDeleted,
  "customer.state_changed": handleCustomerStateChanged,

  // ── Refunds ─────────────────────────────────────────────────────────────
  "refund.created": handleRefundCreated,
  "refund.updated": handleRefundUpdated,
};

/**
 * Parses and dispatches an incoming webhook payload to the appropriate domain handler.
 * Returns the normalized RevstackEvent, or null if the event type is unmapped (ignored).
 *
 * @param payload - The raw JSON payload from the provider's webhook request.
 * @returns An AsyncActionResult containing the normalized RevstackEvent, or null if ignored.
 */
export const parseWebhookEvent = async (
  ctx: ProviderContext,
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
    console.log(`[Revstack] Ignored unmapped polar event: ${payload.type}`);
    return { data: null, status: "success" };
  }

  try {
    const revstackEvent = await handler(ctx, payload);

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
