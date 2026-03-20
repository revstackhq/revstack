import { Checkout } from "@polar-sh/sdk/models/components/checkout.js";
import { CheckoutSessionResult } from "@revstackhq/providers-core";

export function mapSessionToCheckoutResult(
  session: Checkout,
): CheckoutSessionResult {
  return {
    id: session.id,
    expiresAt: session.expiresAt ? new Date(session.expiresAt) : undefined,
  };
}
