import { ProviderContext, AsyncActionResult } from "@revstackhq/providers-core";
import { validateEvent } from "@polar-sh/sdk/webhooks.js";

/**
 * Verifies the incoming Polar webhook signature to confidently authorize event payloads.
 *
 * @param _ctx - Unused provider context.
 * @param payload - The raw incoming webhook buffer.
 * @param headers - The native request headers containing signatures.
 * @param secret - The webhook secret.
 * @returns A boolean tracking signature validation result.
 */
export const verifyWebhookSignature = async (
  _ctx: ProviderContext,
  payload: string | Buffer,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
): Promise<AsyncActionResult<boolean>> => {
  try {
    const normalizedHeaders: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
      if (v)
        normalizedHeaders[k] = Array.isArray(v) ? v[0] || "" : (v as string);
    }

    validateEvent(payload, normalizedHeaders, secret);
    return { data: true, status: "success" };
  } catch (error) {
    return { data: false, status: "failed" };
  }
};
