import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";
import {
  AsyncActionResult,
  ProviderContext,
  DeletePaymentMethodInput,
} from "@revstackhq/providers-core";

/**
 * Detaches a saved payment method from its customer.
 * After detachment the instrument can no longer be used for charges.
 *
 * @param ctx - The provider context.
 * @param input - Contains the payment method ID to detach.
 * @returns An AsyncActionResult yielding `true` if the detachment succeeded.
 */
export async function deletePaymentMethod(
  ctx: ProviderContext,
  input: DeletePaymentMethodInput,
): Promise<AsyncActionResult<boolean>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    await stripe.paymentMethods.detach(input.id);
    return { data: true, status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: false, status: "failed", error: mapped };
  }
}
