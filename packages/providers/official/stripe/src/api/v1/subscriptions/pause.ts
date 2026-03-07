import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  PauseSubscriptionInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Pauses billing collection on an active subscription.
 * Invoices are voided while the subscription is paused to prevent
 * balance accumulation.
 *
 * @param ctx - The provider context.
 * @param input - Contains the subscription ID to pause.
 * @returns An AsyncActionResult yielding the paused subscription ID.
 */
export async function pauseSubscription(
  ctx: ProviderContext,
  input: PauseSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const sub = await stripe.subscriptions.update(
      input.id,
      { pause_collection: { behavior: "void" } },
      { idempotencyKey: ctx.idempotencyKey },
    );
    return { data: sub.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
