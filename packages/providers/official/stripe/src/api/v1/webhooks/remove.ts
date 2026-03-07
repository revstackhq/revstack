import { ProviderContext, AsyncActionResult } from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Removes a registered webhook endpoint from the provider account.
 * Silently handles the case where the endpoint has already been deleted.
 *
 * @param ctx - The provider context.
 * @param webhookId - The endpoint ID to remove.
 * @returns An AsyncActionResult yielding `true` if the removal succeeded.
 */
export async function removeWebhooks(
  ctx: ProviderContext,
  webhookId: string,
): Promise<AsyncActionResult<boolean>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);
  try {
    await stripe.webhookEndpoints.del(webhookId);
    return { data: true, status: "success" };
  } catch (error: unknown) {
    console.warn(
      "Webhook deletion failed (may already be deleted):",
      error as Error,
    );
    return { data: false, status: "failed" };
  }
}
