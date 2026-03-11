import {
  AsyncActionResult,
  ProviderContext,
  RefundPaymentInput,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Refunds a Polar order partially or fully.
 *
 * @param ctx - The provider context.
 * @param input - The refund payload.
 * @returns The ID of the affected order.
 */
export const refundPayment = async (
  ctx: ProviderContext,
  input: RefundPaymentInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreateClient(ctx);
    // Polar requires explicit reason for refunds
    await polar.refunds.create({
      orderId: input.paymentId,
      amount: input.amount || 0, // If 0, polar throws an error, which is correct (refunds must have amount > 1)
      reason: "customer_request",
    });

    // We must fetch the order again to get updated totalRefunded
    const order = await polar.orders.get({
      id: input.paymentId,
    });

    return {
      data: order.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};
