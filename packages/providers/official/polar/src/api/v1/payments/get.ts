import {
  AsyncActionResult,
  Payment,
  ProviderContext,
  GetPaymentInput,
} from "@revstackhq/providers-core";
import { mapPolarOrderToPayment } from "@/api/v1/payments/mapper";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Fetches an order from Polar and returns it as a Payment.
 *
 * @param ctx - The provider context.
 * @param input - The input containing the payment ID.
 * @returns The mapped payment object.
 */
export const getPayment = async (
  ctx: ProviderContext,
  input: GetPaymentInput,
): Promise<AsyncActionResult<Payment>> => {
  try {
    const polar = getOrCreateClient(ctx);
    const order = await polar.orders.get({
      id: input.id,
    });

    return {
      data: mapPolarOrderToPayment(order),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};
