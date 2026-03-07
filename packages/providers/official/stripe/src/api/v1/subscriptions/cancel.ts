import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CancelSubscriptionInput,
  AsyncActionResult,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import Stripe from "stripe";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Cancels an active subscription.
 * Supports both immediate termination and end-of-period cancellation.
 * Gracefully handles the case where the subscription is already canceled.
 *
 * @param ctx - The provider context.
 * @param input - Contains the subscription ID, cancellation timing, and optional reason.
 * @returns An AsyncActionResult yielding the canceled subscription ID.
 */
export async function cancelSubscription(
  ctx: ProviderContext,
  input: CancelSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    let sub;

    if (input.immediate) {
      sub = await stripe.subscriptions.cancel(input.id, {
        cancellation_details: {
          comment: input.reason || null,
          feedback: "other",
        },
        invoice_now: true,
        prorate: true,
      });
    } else {
      sub = await stripe.subscriptions.update(input.id, {
        cancel_at_period_end: true,
        cancellation_details: {
          comment: input.reason || null,
          feedback: "other",
        },
      });
    }

    return { data: sub.id, status: "success" };
  } catch (error: any) {
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === "resource_missing") {
        return {
          data: null,
          status: "failed",
          error: {
            code: RevstackErrorCode.SubscriptionNotFound,
            message: error.message,
            providerError: error.code,
          },
        };
      }
      if (
        error.message.includes("cancel") ||
        error.message.includes("status")
      ) {
        return {
          data: null,
          status: "failed",
          error: {
            code: RevstackErrorCode.InvalidState,
            message: error.message,
            providerError: error.code,
          },
        };
      }
    }
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
