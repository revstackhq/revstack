import {
  AsyncActionResult,
  PaginatedResult,
  Payment,
  ProviderContext,
  buildPagePagination,
  ListPaymentsOptions,
} from "@revstackhq/providers-core";
import { mapPolarOrderToPayment } from "@/api/v1/payments/mapper";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Paginates Polar orders and maps them to Payment objects.
 *
 * @param ctx - The provider context.
 * @param options - Pagination boundaries and limits.
 * @returns A paginated array of mapped payments.
 */
export const listPayments = async (
  ctx: ProviderContext,
  options: ListPaymentsOptions,
): Promise<AsyncActionResult<PaginatedResult<Payment>>> => {
  try {
    const polar = getOrCreateClient(ctx);
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
