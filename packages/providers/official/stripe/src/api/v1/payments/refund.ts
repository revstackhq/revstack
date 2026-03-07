import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  RefundPaymentInput,
  AsyncActionResult,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

/**
 * Initiates a partial or full refund for a captured payment.
 * Injects the trace ID into refund metadata for cross-service observability.
 *
 * @param ctx - The provider context instance.
 * @param input - Contains the payment ID, optional amount, and reason.
 * @returns An AsyncActionResult yielding the refund ID.
 */
export async function refundPayment(
  ctx: ProviderContext,
  input: RefundPaymentInput,
): Promise<AsyncActionResult<string>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    const refund = await stripe.refunds.create(
      {
        payment_intent: input.paymentId,
        amount: input.amount,
        reason: input.reason as Stripe.RefundCreateParams.Reason,
        metadata: {
          revstack_trace_id: ctx.traceId || null,
        },
      },
      { idempotencyKey: ctx.idempotencyKey },
    );

    return { data: refund.id, status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return {
      data: null,
      status: "failed",
      error: {
        code:
          mapped.code === RevstackErrorCode.UnknownError
            ? RevstackErrorCode.RefundFailed
            : mapped.code,
        message: mapped.message,
        providerError: mapped.providerError,
      },
    };
  }
}
