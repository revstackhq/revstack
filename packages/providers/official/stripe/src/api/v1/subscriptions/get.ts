import { toSubscription } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  Subscription,
  AsyncActionResult,
  GetSubscriptionInput,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Retrieves a full subscription record by its provider ID.
 * Normalizes all nested provider structures into a predictable Revstack shape.
 *
 * @param ctx - The provider context.
 * @param input - Contains the subscription ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Revstack Subscription.
 */
export async function getSubscription(
  ctx: ProviderContext,
  input: GetSubscriptionInput,
): Promise<AsyncActionResult<Subscription>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const sub = await stripe.subscriptions.retrieve(input.id);
    return { data: toSubscription(sub), status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
