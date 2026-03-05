import {
  AsyncActionResult,
  CreatePaymentInput,
  PaginatedResult,
  Payment,
  ProviderContext,
  CheckoutSessionResult,
  buildPagePagination,
  RevstackErrorCode,
  CheckoutSessionInput,
  GetPaymentInput,
  RefundPaymentInput,
  ListPaymentsOptions,
  CapturePaymentInput,
} from "@revstackhq/providers-core";
import { mapPolarOrderToPayment } from "@/api/v1/mappers";
import { getOrCreatePolar } from "@/api/v1/client";
import { resolveJitProductId } from "@/utils/jit";
import { mapError } from "@/shared/error-map";

/**
 * Creates a server-side payment dynamically through a hosted Polar Checkout Session.
 * Since Polar requires explicit products for checkout, this automatically creates a Just-In-Time (JIT)
 * one-time product matching the requested amount and currency.
 *
 * @param ctx - The provider context.
 * @param input - The creation payload with amount and currency.
 * @param createCheckoutSession - Injected checkout session creator.
 * @returns The generated checkout session ID.
 */
export const createPayment = async (
  ctx: ProviderContext,
  input: CreatePaymentInput,
  createCheckoutSession: (
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ) => Promise<AsyncActionResult<CheckoutSessionResult>>,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreatePolar(ctx);

    const resolvedLineItems = await Promise.all(
      input.lineItems.map(async (item: any) => {
        if ("amount" in item) {
          const priceId = await resolveJitProductId(polar, ctx, {
            jit: {
              name: item.name,
              amount: item.amount,
              currency: item.currency,
              trialInterval: item.trialInterval,
              trialIntervalCount: item.trialIntervalCount,
              description: item.description,
            },
          });
          return { priceId, quantity: item.quantity };
        }
        return { priceId: item.priceId, quantity: item.quantity };
      }),
    );

    const result = await createCheckoutSession(ctx, {
      mode: "payment",
      ...input,
      lineItems: resolvedLineItems,
    });

    return {
      data: result.data?.id || null,
      status: result.status,
      nextAction: result.nextAction,
      error: result.error,
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
};

/**
 * Fetches an order from Polar and returns it as a Payment.
 *
 * @param ctx - The provider context.
 * @param paymentId - The Polar order ID.
 * @returns The mapped payment object.
 */
export const getPayment = async (
  ctx: ProviderContext,
  input: GetPaymentInput,
): Promise<AsyncActionResult<Payment>> => {
  try {
    const polar = getOrCreatePolar(ctx);
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

/**
 * Paginates Polar orders and maps them to Payment objects.
 *
 * @param ctx - The provider context.
 * @param options - Pagination boundaries and limits.
 * @param filters - Optional filters.
 * @returns A paginated array of mapped payments.
 */
export const listPayments = async (
  ctx: ProviderContext,
  options: ListPaymentsOptions,
): Promise<AsyncActionResult<PaginatedResult<Payment>>> => {
  try {
    const polar = getOrCreatePolar(ctx);
    const targetPage =
      options?.page ||
      (options?.startingAfter && parseInt(options.startingAfter) + 1) ||
      (options?.endingBefore &&
        Math.max(1, parseInt(options.endingBefore) - 1)) ||
      1;
    const limit = options?.limit || 10;

    const ordersPage = await polar.orders.list({
      customerId: options?.customerId,
      limit,
      page: targetPage,
      ...options?.filters,
    });

    return {
      data: buildPagePagination(
        ordersPage.result.items,
        targetPage,
        ordersPage.result.pagination.maxPage,
        mapPolarOrderToPayment,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};

/**
 * Refunds a Polar order partially or fully.
 *
 * @param ctx - The provider context.
 * @param paymentId - The Polar order ID.
 * @param amount - Optional explicit amount to refund.
 * @returns The ID of the affected order.
 */
export const refundPayment = async (
  ctx: ProviderContext,
  input: RefundPaymentInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreatePolar(ctx);
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

/**
 * Captures an uncaptured Polar payment. Returns NotImplemented as Polar does not support this manually.
 *
 * @param _ctx - Unused provider context.
 * @param _paymentId - Unused ID.
 * @param _amount - Unused amount.
 * @returns A NotImplemented Error.
 */
export const capturePayment = async (
  _ctx: ProviderContext,
  _input: CapturePaymentInput,
): Promise<AsyncActionResult<string>> => {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Manual capture is not supported by Polar logic yet.",
    },
  };
};
