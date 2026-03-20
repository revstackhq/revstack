import { getOrCreateClient } from "@/api/v1/client";
import { mapPolarOrderToPayment } from "@/api/v1/payments/mapper";
import { mapError } from "@/shared/error-map";
import {
  AsyncActionResult,
  buildPagePagination,
  ListPaymentsOptions,
  PaginatedResult,
  Payment,
  ProviderContext,
} from "@revstackhq/providers-core";

export const listPayments = async (
  ctx: ProviderContext,
  options: ListPaymentsOptions,
): Promise<AsyncActionResult<PaginatedResult<Payment>>> => {
  try {
    const polar = getOrCreateClient(ctx);

    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const response = await polar.orders.list({
      customerId: options.customerId,
      limit,
      page,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        response.result.items,
        page,
        response.result.pagination.maxPage,
        mapPolarOrderToPayment,
      ),
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      status: "failed",
      error: error.isRevstackError ? error.errorPayload : mapError(error),
    };
  }
};
