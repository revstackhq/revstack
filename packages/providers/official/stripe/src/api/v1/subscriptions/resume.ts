import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  ResumeSubscriptionInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Resumes billing collection on a paused subscription.
 * Clears the pause state and re-enables automatic invoicing.
 *
 * @param ctx - The provider context.
 * @param input - Contains the subscription ID to resume.
 * @returns An AsyncActionResult yielding the resumed subscription ID.
 */
export async function resumeSubscription(
  ctx: ProviderContext,
  input: ResumeSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const sub = await stripe.subscriptions.update(
      input.id,
      { pause_collection: null },
      { idempotencyKey: ctx.idempotencyKey },
    );
    return { data: sub.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
