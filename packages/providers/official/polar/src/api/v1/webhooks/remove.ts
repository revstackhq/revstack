import { ProviderContext, AsyncActionResult } from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Removes the configured webhook endpoint from the connected Polar organization.
 *
 * @param ctx - The provider context.
 * @param webhookId - The explicit webhook ID to delete.
 * @returns A boolean representing removal success.
 */
export const removeWebhooks = async (
  ctx: ProviderContext,
  webhookId: string,
): Promise<AsyncActionResult<boolean>> => {
  const polar = getOrCreateClient(ctx);
  try {
    await polar.webhooks.deleteWebhookEndpoint({ id: webhookId });
    return { data: true, status: "success" };
  } catch (error: unknown) {
    return { data: false, status: "failed" };
  }
};
