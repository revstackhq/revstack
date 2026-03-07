import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  AsyncActionResult,
  CapturePaymentInput,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Captures a previously authorized but uncaptured payment.
 * Supports partial captures — defaults to the full authorized amount
 * if no specific amount is provided.
 *
 * @param ctx - The provider context instance.
 * @param input - Contains the payment ID and optional partial capture amount.
 * @returns An AsyncActionResult yielding the captured payment ID.
 */
export async function capturePayment(
  ctx: ProviderContext,
  input: CapturePaymentInput,
): Promise<AsyncActionResult<string>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    const pi = await stripe.paymentIntents.capture(input.id, {
      ...(input.amount ? { amount_to_capture: input.amount } : {}),
    });

    return { data: pi.id, status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: null, status: "failed", error: mapped };
  }
}
