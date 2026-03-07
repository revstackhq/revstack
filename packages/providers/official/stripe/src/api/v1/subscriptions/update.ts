import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  UpdateSubscriptionInput,
  AsyncActionResult,
 toUnixSeconds } from "@revstackhq/providers-core";
import Stripe from "stripe";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Builds the provider-specific update params from the Revstack UpdateSubscriptionInput.
 * Handles price swaps, quantity changes, and trial end date calculations.
 */
async function buildUpdateParams(
  stripe: Stripe,
  id: string,
  input: UpdateSubscriptionInput,
): Promise<Stripe.SubscriptionUpdateParams> {
  const updateParams: Stripe.SubscriptionUpdateParams = {
    metadata: input.metadata,
    proration_behavior: input.proration || "create_prorations",
  };

  if (input.lineItems && input.lineItems.length > 0) {
    updateParams.items = input.lineItems.map((item) => {
      if (item.id) {
        return {
          id: item.id,
          price: item.priceId,
          quantity: item.quantity,
          deleted: item.deleted,
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
      throw new Error(
        "Subscription update requires either an item 'id' or a 'priceId'.",
      );
    });
  }

  if (input.trialEnd) {
    updateParams.trial_end =
      input.trialEnd === "now"
        ? "now"
        : toUnixSeconds(new Date(input.trialEnd));
  }

  return updateParams;
}

/**
 * Modifies core properties of an active subscription.
 * Handles price swaps, quantity changes, proration, and trial end extensions.
 *
 * @param ctx - The provider context.
 * @param input - The changes to apply (line items, metadata, trial end, etc.).
 * @returns An AsyncActionResult yielding the updated subscription ID.
 */
export async function updateSubscription(
  ctx: ProviderContext,
  input: UpdateSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const updateParams = await buildUpdateParams(stripe, input.id, input);

    const sub = await stripe.subscriptions.update(input.id, updateParams, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: sub.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
