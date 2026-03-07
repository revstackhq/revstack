import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreateSubscriptionInput,
  AsyncActionResult,
  CheckoutSessionInput,
  CheckoutSessionResult,
} from "@revstackhq/providers-core";

/**
 * Initiates a subscription through a hosted checkout session flow.
 * Operates in 'subscription' mode, supporting line items with quantity
 * structures and optional trial periods.
 *
 * @param ctx - The provider context.
 * @param input - Contains customer ID, price ID, and routing URLs.
 * @param createCheckoutSession - Injected dependency for session creation.
 * @returns An AsyncActionResult yielding the session ID or redirect URL.
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
    const result = await createCheckoutSession(ctx, {
      mode: "subscription",
      ...input,
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
