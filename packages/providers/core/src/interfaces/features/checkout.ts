import { ProviderContext } from "@/context";
import {
  CheckoutSessionInput,
  CheckoutSessionResult,
  CreatePaymentLinkInput,
} from "@/types/checkout";
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

  /**
   * Creates a persistent, shareable payment URL.
   * Useful for manual overage billing or asynchronous payment collection.
   * Required when `billing.paymentLinks` is true.
   * * @param ctx - The provider execution context.
   * @param input - The payment details including amount, currency, and customer info.
   * @returns An AsyncActionResult containing the generated payment URL.
   */
  createPaymentLink?(
    ctx: ProviderContext,
    input: CreatePaymentLinkInput,
  ): Promise<AsyncActionResult<string>>;
}
