import { getOrCreateClient } from "@/api/v1/client";
import {
  AsyncActionResult,
  ProviderContext,
  CancelSubscriptionInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { mapError } from "@/shared/error-map";
import { SubscriptionUpdate } from "@polar-sh/sdk/models/components/subscriptionupdate.js";

/**
 * Gracefully cancels an active Polar subscription.
 *
 * @param ctx - The provider context.
 * @param input - The active subscription ID and whether cancellation is immediate.
 * @returns The ID of the cancelled subscription.
 */
export async function cancelSubscription(
  ctx: ProviderContext,
  input: CancelSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx);

    const update: SubscriptionUpdate = input.immediate
      ? { revoke: true }
      : { cancelAtPeriodEnd: true };

    const sub = await polar.subscriptions.update({
      id: input.id,
      subscriptionUpdate: update,
    });

    return {
      data: sub.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.SubscriptionNotFound,
          message: error.message,
          providerError: error.name,
        },
      };
    }
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
