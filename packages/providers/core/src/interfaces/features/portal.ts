import { ProviderContext } from "@/context";
import { AsyncActionResult } from "@/types/shared";
import { BillingPortalInput, BillingPortalResult } from "@/types/portal";

/**
 * Interface for Customer Portal operations.
 */
export interface IBillingPortalFeature {
  /**
   * Creates a billing portal session URL.
   *
   * This allows customers to securely manage their own subscriptions, payment methods, and billing information
   * without exposing sensitive operations to the merchant's backend.
   *
   *
   * @param ctx - The execution context.
   * @param input - Configuration for the portal session, including the return URL and optional customer ID.
   * @returns A result containing the `nextAction.url` for redirection.
   */
  createBillingPortalSession?(
    ctx: ProviderContext,
    input: BillingPortalInput,
  ): Promise<AsyncActionResult<BillingPortalResult>>;
}
