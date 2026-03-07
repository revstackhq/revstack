import { mapError } from "@/shared/error-map";
import { ProviderContext, AsyncActionResult } from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Validates the provider credentials stored in the context.
 * Performs a lightweight API call to confirm the API key is active and authorized.
 *
 * @param ctx - The provider context containing the API key.
 * @returns An AsyncActionResult yielding `true` if the credentials are valid.
 */
export async function validateCredentials(
  ctx: ProviderContext,
): Promise<AsyncActionResult<boolean>> {
  if (!ctx.config.apiKey) return { data: false, status: "success" };

  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    await stripe.paymentIntents.list({ limit: 1 });
    return { data: true, status: "success" };
  } catch {
    return { data: false, status: "failed" };
  }
}
