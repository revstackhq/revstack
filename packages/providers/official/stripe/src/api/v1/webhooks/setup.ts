import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  InstallResult,
  AsyncActionResult,
  RevstackError,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

/**
 * Provisions webhook endpoints on the provider account for the given URL.
 * If an endpoint for the URL already exists, it is updated with the full
 * event list rather than creating a duplicate. The signing secret is only
 * returned on creation — update responses do not include it.
 *
 * @param ctx - The provider context.
 * @param webhookUrl - The absolute URL that will receive event payloads.
 * @returns An AsyncActionResult containing the endpoint ID and (on first creation) the signing secret.
 */
export async function setupWebhooks(
  ctx: ProviderContext,
  webhookUrl: string,
): Promise<AsyncActionResult<InstallResult>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  const enabled_events: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
    // Payments
    "payment_intent.created",
    "payment_intent.amount_capturable_updated",
    "payment_intent.processing",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    // Refunds
    "refund.created",
    "charge.refunded",
    "refund.failed",
    // Disputes
    "charge.dispute.created",
    "charge.dispute.updated",
    "charge.dispute.closed",
    // Checkouts
    "checkout.session.completed",
    "checkout.session.expired",
    "checkout.session.async_payment_failed",
    // Subscriptions
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
    "customer.subscription.trial_will_end",
    // Invoices
    "invoice.created",
    "invoice.finalized",
    "invoice.paid",
    "invoice.payment_failed",
    "invoice.voided",
    "invoice.marked_uncollectible",
    // Customers
    "customer.created",
    "customer.updated",
    "customer.deleted",
    // Payment Methods
    "payment_method.attached",
    "payment_method.updated",
    "payment_method.detached",
    // Mandates
    "mandate.updated",
    // Catalog
    "product.created",
    "product.updated",
    "product.deleted",
    "price.created",
    "price.updated",
    "price.deleted",
  ];

  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existingWebhook = webhooks.data.find((wh) => wh.url === webhookUrl);

    let webhookEndpoint;
    let secret: string | undefined;

    if (existingWebhook) {
      // Updating an existing endpoint — the provider does NOT return the secret on updates
      webhookEndpoint = await stripe.webhookEndpoints.update(
        existingWebhook.id,
        { enabled_events },
      );
      secret = undefined;
    } else {
      webhookEndpoint = await stripe.webhookEndpoints.create({
        enabled_events,
        url: webhookUrl,
      });
      // Secret is only available at creation time
      secret = webhookEndpoint.secret;
    }

    const data: Record<string, any> = { webhookEndpointId: webhookEndpoint.id };
    if (secret) data.webhookSecret = secret;

    return { data: { success: true, data }, status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    throw new RevstackError({
      code: mapped.code,
      message: mapped.message,
      provider: "stripe",
      cause: error,
    });
  }
}
