import { ProviderContext } from "@/context";
import { CheckoutSessionInput, CheckoutSessionResult } from "@/types/checkout";
import { AsyncActionResult } from "@/types/shared";

/**
 * Interface for Hosted Checkout operations.
 * Generates secure URLs for off-site payment pages (e.g., Stripe Checkout).
 */
export interface ICheckoutFeature {
  /**
   * Generates a hosted checkout session URL.
   *
   * This is the preferred integration method for security compliance, as it
   * offloads PCI-DSS responsibility to the provider.
   *
   * @param ctx - The execution context.
   * @param input - Line items, success/cancel URLs, and mode (payment/subscription).
   * @returns A result containing the `nextAction.url` for redirection.
   */
  createCheckoutSession(
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ): Promise<AsyncActionResult<CheckoutSessionResult>>;
}
