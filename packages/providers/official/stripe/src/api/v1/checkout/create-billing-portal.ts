import {
  ProviderContext,
  BillingPortalInput,
  BillingPortalResult,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Creates a hosted billing portal session for a customer.
 * The portal allows customers to manage subscriptions, update payment methods,
 * and view invoices — without requiring a custom-built UI.
 *
 * @param ctx - The provider context.
 * @param input - Contains the customer ID and the return URL after the portal visit.
 * @returns An AsyncActionResult with a redirect next action pointing to the portal URL.
 */
export async function createBillingPortalSession(
  ctx: ProviderContext,
  input: BillingPortalInput,
): Promise<AsyncActionResult<BillingPortalResult>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: input.customerId,
      return_url: input.returnUrl,
    });

    return {
      data: null,
      status: "success",
      nextAction: { type: "redirect", url: session.url },
    };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: null, status: "failed", error: mapped };
  }
}
