import { createCheckoutSession } from "@/api/v1/checkout";
import {
  ProviderContext,
  AsyncActionResult,
  CheckoutSessionResult,
  SetupPaymentMethodInput,
} from "@revstackhq/providers-core";

/**
 * Initiates a payment method setup flow via a hosted checkout session.
 * Operates in 'setup' mode — no charge is taken; the goal is to authorize
 * and save the instrument for future off-session use.
 *
 * @param ctx - The provider context.
 * @param input - Contains the customer ID and redirect URLs.
 * @returns An AsyncActionResult yielding a CheckoutSessionResult with a redirect URL.
 */
export async function setupPaymentMethod(
  ctx: ProviderContext,
  input: SetupPaymentMethodInput,
): Promise<AsyncActionResult<CheckoutSessionResult>> {
  return createCheckoutSession(ctx, {
    mode: "setup",
    customerId: input.customerId,
    successUrl: input.returnUrl,
    cancelUrl: input.cancelUrl,
    metadata: input.metadata,
    currency: input.currency,
    lineItems: [],
  });
}
