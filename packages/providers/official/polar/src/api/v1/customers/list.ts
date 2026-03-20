import {
  AsyncActionResult,
  ListCustomersOptions,
  Customer,
  ProviderContext,
  PaginatedResult,
  buildPagePagination,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapPolarCustomerToCustomer } from "@/api/v1/customers/mapper";
import { mapError } from "@/shared/error-map";

/**
 * Lists out and paginates Polar customers.
 *
 * @param ctx - The provider context.
 * @param options - Pagination options.
 * @returns A paginated response of matched customers.
 */
export const listCustomers = async (
  ctx: ProviderContext,
  options: ListCustomersOptions,
): Promise<AsyncActionResult<PaginatedResult<Customer>>> => {
  try {
    const polar = getOrCreateClient(ctx);
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const response = await polar.customers.list({
      limit,
      page,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        response.result.items,
        page,
        response.result.pagination.maxPage,
        mapPolarCustomerToCustomer,
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
