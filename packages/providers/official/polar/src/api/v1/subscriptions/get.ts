import { getOrCreateClient } from "@/api/v1/client";
import { mapPolarSubscriptionToSubscription } from "@/api/v1/subscriptions/mapper";
import {
  AsyncActionResult,
  ProviderContext,
  Subscription,
  GetSubscriptionInput,
} from "@revstackhq/providers-core";
import { mapError } from "@/shared/error-map";

/**
 * Fetches an active comprehensive subscription from Polar.
 *
 * @param ctx - The provider context.
 * @param input - The active subscription ID.
 * @returns The cleanly mapped Revstack subscription.
 */
export async function getSubscription(
  ctx: ProviderContext,
  input: GetSubscriptionInput,
): Promise<AsyncActionResult<Subscription>> {
  try {
    const polar = getOrCreateClient(ctx);
    const sub = await polar.subscriptions.get({ id: input.id });
    return {
      data: mapPolarSubscriptionToSubscription(sub),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
