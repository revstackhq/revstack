import {
  ProviderContext,
  InstallResult,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { WebhookEventType } from "@polar-sh/sdk/models/components/webhookeventtype.js";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Automatically creates or updates the required webhook endpoints in Polar.
 * Ensures the Revstack integration receives all necessary event payloads.
 *
 * @param ctx - The provider context.
 * @param webhookUrl - The endpoint URL to route Webhooks.
 * @returns An object containing the webhook ID and initial secret payload.
 */
export const setupWebhooks = async (
  ctx: ProviderContext,
  webhookUrl: string,
): Promise<AsyncActionResult<InstallResult>> => {
  const polar = getOrCreateClient(ctx);

  try {
    const events: WebhookEventType[] = [
      "checkout.created",
      "checkout.updated",
      "checkout.expired",
      "customer.created",
      "customer.updated",
      "customer.deleted",
      "customer.state_changed",
      "order.created",
      "order.updated",
      "order.paid",
      "order.refunded",
      "subscription.created",
      "subscription.updated",
      "subscription.active",
      "subscription.canceled",
      "subscription.uncanceled",
      "subscription.revoked",
      "subscription.past_due",
      "refund.created",
      "refund.updated",
      "product.created",
      "product.updated",
    ];

    const webhooksList = await polar.webhooks.listWebhookEndpoints({
      organizationId: ctx.config.organizationId as string,
      limit: 100,
    });
    const existingWebhook = webhooksList.result.items.find(
      (wh) => wh.url === webhookUrl,
    );

    let webhookEndpointId: string;
    let secret: string | undefined;

    if (existingWebhook) {
      const updated = await polar.webhooks.updateWebhookEndpoint({
        id: existingWebhook.id,
        webhookEndpointUpdate: {
          url: webhookUrl,
          format: "raw",
          events,
        },
      });
      webhookEndpointId = updated.id;
      secret = undefined;
    } else {
      const created = await polar.webhooks.createWebhookEndpoint({
        url: webhookUrl,
        format: "raw",
        events,
        name: "Revstack",
      });
      webhookEndpointId = created.id;
      secret = created.secret;
    }

    const data: Record<string, any> = {
      webhookEndpointId,
      accessToken: ctx.config.accessToken,
      organizationId: ctx.config.organizationId,
    };

    if (secret) {
      data.webhookSecret = secret;
    }

    return {
      data: { success: true, data },
      status: "success",
    };
  } catch (error: any) {
    return {
      data: { success: false, data: {} },
      status: "failed",
      error: { code: "UNKNOWN_ERROR", message: error.message },
    };
  }
};
