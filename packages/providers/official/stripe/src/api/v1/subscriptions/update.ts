import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  UpdateSubscriptionInput,
  AsyncActionResult,
  toUnixSeconds,
  RevstackError,
  RevstackErrorCode,
  ProrationBehavior,
} from "@revstackhq/providers-core";
import Stripe from "stripe";
import { getOrCreateClient } from "@/api/v1/client";

function mapProrationBehavior(
  behavior: ProrationBehavior,
): Stripe.SubscriptionUpdateParams.ProrationBehavior {
  switch (behavior) {
    case "immediate":
      return "always_invoice";
    case "deferred":
      return "create_prorations";
    default:
      return "create_prorations";
  }
}

async function buildUpdateParams(
  input: UpdateSubscriptionInput,
): Promise<Stripe.SubscriptionUpdateParams> {
  const updateParams: Stripe.SubscriptionUpdateParams = {
    metadata: input.metadata,
    proration_behavior: mapProrationBehavior(input.proration ?? "none"),
  };

  if (input.lineItems && input.lineItems.length > 0) {
    updateParams.items = input.lineItems.map((item) => {
      if (item.id) {
        return {
          id: item.id,
          price: item.priceId,
          quantity: item.quantity,
          deleted: item.deleted || undefined,
          metadata: item.metadata,
        };
      }

      if (item.priceId) {
        return {
          price: item.priceId,
          quantity: item.quantity,
          metadata: item.metadata,
        };
      }

      throw new RevstackError({
        code: RevstackErrorCode.InvalidInput,
        cause: "subscription_update_item",
        message:
          "Subscription update item requires either an internal provider 'id' or a 'priceId'.",
      });
    });
  }

  if (input.trialEnd) {
    if (input.trialEnd === "now") {
      updateParams.trial_end = "now";
    } else {
      const date =
        typeof input.trialEnd === "string"
          ? new Date(input.trialEnd)
          : input.trialEnd;
      updateParams.trial_end = toUnixSeconds(date);
    }
  }

  return updateParams;
}

export async function updateSubscription(
  ctx: ProviderContext,
  input: UpdateSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const updateParams = await buildUpdateParams(input);

    const sub = await stripe.subscriptions.update(input.id, updateParams, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: sub.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
