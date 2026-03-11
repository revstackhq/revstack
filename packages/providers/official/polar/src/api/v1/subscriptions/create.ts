import { getOrCreateClient } from "@/api/v1/client";
import {
  AsyncActionResult,
  CreateSubscriptionInput,
  ProviderContext,
  CheckoutSessionResult,
  CheckoutSessionInput,
  CustomLineItem,
} from "@revstackhq/providers-core";
import { resolveJitProductId } from "@/utils/jit";
import { mapError } from "@/shared/error-map";

/**
 * Defers Polar subscription creation safely to a checkout session.
 *
 * @param ctx - The provider context.
 * @param input - The explicit subscription input limits.
 * @param createCheckoutSession - Subjugated checkout function hook.
 * @returns A result yielding the redirect URL or checkout session.
 */
export async function createSubscription(
  ctx: ProviderContext,
  input: CreateSubscriptionInput,
  createCheckoutSession: (
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ) => Promise<AsyncActionResult<CheckoutSessionResult>>,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx);

    const lineItems = input.lineItems as CustomLineItem[];

    const totalAmount = lineItems.reduce(
      (acc, item) => acc + item.amount * (item.quantity || 1),
      0,
    );

    const bundleName = lineItems
      .map((i) => `${i.quantity || 1}x ${i.name}`)
      .join(" + ");

    const baseInterval = lineItems[0]?.interval;

    const bundlePriceId = await resolveJitProductId(polar, ctx, {
      jit: {
        name: bundleName,
        amount: totalAmount,
        currency: lineItems[0]?.currency || "usd",
        interval: baseInterval,
        description: "Consolidated subscription bundle",
        trialInterval: lineItems[0]?.trialInterval,
        trialIntervalCount: lineItems[0]?.trialIntervalCount,
      },
    });

    const result = await createCheckoutSession(ctx, {
      mode: "subscription",
      ...input,
      lineItems: [{ priceId: bundlePriceId, quantity: 1 }],
      metadata: {
        ...input.metadata,
        order_id: input.clientReferenceId,
      },
    });

    return {
      data: result.data?.id || null,
      status: result.status,
      nextAction: result.nextAction,
      error: result.error,
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
