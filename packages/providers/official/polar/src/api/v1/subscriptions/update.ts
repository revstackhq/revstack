import { getOrCreateClient } from "@/api/v1/client";
import {
  AsyncActionResult,
  ProviderContext,
  RevstackErrorCode,
  UpdateSubscriptionInput,
} from "@revstackhq/providers-core";
import { mapError } from "@/shared/error-map";

/**
 * Replaces the product configuration for an active Polar subscription.
 *
 * @param ctx - The provider context.
 * @param input - The update payload with the new price ID.
 * @returns The successfully updated subscription ID.
 */
export async function updateSubscription(
  ctx: ProviderContext,
  input: UpdateSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx);

    const mainItem = input.lineItems?.find((item: any) => "priceId" in item);

    if (!mainItem || !("priceId" in mainItem) || !mainItem.priceId) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.InvalidInput,
          message:
            "Polar requires a valid Price ID in line items for subscription updates.",
        },
      };
    }

    const sub = await polar.subscriptions.update({
      id: input.id,
      subscriptionUpdate: {
        prorationBehavior: input.proration === "none" ? "invoice" : "prorate",
        productId: mainItem.priceId,
      },
    });

    return {
      data: sub.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
