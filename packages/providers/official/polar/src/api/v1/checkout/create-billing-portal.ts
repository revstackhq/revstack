import {
  ProviderContext,
  AsyncActionResult,
  BillingPortalInput,
  BillingPortalResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Creates a Billing Portal session using Polar's native Customer Portal functionality.
 * Allows users to self-manage subscriptions and payments.
 *
 * @param ctx - The provider execution context.
 * @param input - The portal session parameters.
 * @returns An AsyncActionResult with a redirect URL to the portal.
 */
export async function createBillingPortalSession(
  ctx: ProviderContext,
  input: BillingPortalInput,
): Promise<AsyncActionResult<BillingPortalResult>> {
  const polar = getOrCreateClient(ctx);

  try {
    const session = await polar.customerSessions.create({
      customerId: input.customerId,
      returnUrl: input.returnUrl || undefined,
    });

    return {
      data: null,
      status: "requires_action",
      nextAction: {
        type: "redirect",
        url: session.customerPortalUrl,
      },
    };
  } catch (error) {
    return {
      data: null,
      status: "failed",
      error: mapError(error),
    };
  }
}
