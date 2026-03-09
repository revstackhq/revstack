import {
  ProviderContext,
  AsyncActionResult,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Verifies the cryptographic signature of an incoming webhook payload.
 * Compares the provider-sent signature against the expected value computed
 * from the raw body and the registered signing secret.
 *
 * @param ctx - The provider context.
 * @param payload - The raw request body (string or buffer — must be unmodified).
 * @param headers - The raw HTTP request headers.
 * @param secret - The registered webhook signing secret.
 * @returns An AsyncActionResult yielding `true` if the signature is valid.
 */
export async function verifyWebhookSignature(
  ctx: ProviderContext,
  payload: string | Buffer,
  headers: Record<string, string | string[] | undefined>,
  secret: string,
): Promise<AsyncActionResult<boolean>> {
  const signatureHeader = headers["stripe-signature"];
  if (!signatureHeader || !secret) return { data: false, status: "failed" };

  const signature = Array.isArray(signatureHeader)
    ? signatureHeader[0]
    : signatureHeader;
  if (!signature) return { data: false, status: "failed" };

  const stripe = getOrCreateClient(ctx.config.apiKey);
  try {
    stripe.webhooks.constructEvent(payload, signature, secret);
    return { data: true, status: "success" };
  } catch (error: any) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.WebhookSignatureVerificationFailed,
        providerError: "stripe_signature",
        message: error.message || "Invalid signature",
      },
    };
  }
}
