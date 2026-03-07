import {
  ProviderContext,
  CreatePaymentInput,
  AsyncActionResult,
  CheckoutSessionInput,
  CheckoutSessionResult,
} from "@revstackhq/providers-core";

/**
 * Initiates a payment through a hosted checkout session flow.
 * Delegates to the checkout session creator, operating in 'payment' mode.
 *
 * @param ctx - The provider context.
 * @param input - Payment payload including amount, line items, and redirect URLs.
 * @param createCheckoutSession - Injected dependency for session creation.
 * @returns An AsyncActionResult yielding the session ID or redirect URL.
 */
export async function createPayment(
  ctx: ProviderContext,
  input: CreatePaymentInput,
  createCheckoutSession: (
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ) => Promise<AsyncActionResult<CheckoutSessionResult>>,
): Promise<AsyncActionResult<string>> {
  const result = await createCheckoutSession(ctx, {
    mode: "payment",
    ...input,
  });

  return {
    data: result.data?.id || null,
    status: result.status,
    nextAction: result.nextAction,
    error: result.error,
  };
}
