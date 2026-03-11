import {
  AsyncActionResult,
  CreatePaymentInput,
  ProviderContext,
  CheckoutSessionResult,
  CheckoutSessionInput,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { resolveJitProductId } from "@/utils/jit";
import { mapError } from "@/shared/error-map";

/**
 * Creates a server-side payment dynamically through a hosted Polar Checkout Session.
 * Since Polar requires explicit products for checkout, this automatically creates a Just-In-Time (JIT)
 * one-time product matching the requested amount and currency.
 *
 * @param ctx - The provider context.
 * @param input - The creation payload with amount and currency.
 * @param createCheckoutSession - Injected checkout session creator.
 * @returns The generated checkout session ID.
 */
export const createPayment = async (
  ctx: ProviderContext,
  input: CreatePaymentInput,
  createCheckoutSession: (
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ) => Promise<AsyncActionResult<CheckoutSessionResult>>,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreateClient(ctx);

    const resolvedLineItems = await Promise.all(
      input.lineItems.map(async (item: any) => {
        if ("amount" in item) {
          const priceId = await resolveJitProductId(polar, ctx, {
            jit: {
              name: item.name,
              amount: item.amount,
              currency: item.currency,
              trialInterval: item.trialInterval,
              trialIntervalCount: item.trialIntervalCount,
              description: item.description,
            },
          });
          return { priceId, quantity: item.quantity };
        }
        return { priceId: item.priceId, quantity: item.quantity };
      }),
    );

    const result = await createCheckoutSession(ctx, {
      mode: "payment",
      ...input,
      lineItems: resolvedLineItems,
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
};
