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
    const targetPage =
      options.page ||
      (options.startingAfter && parseInt(options.startingAfter) + 1) ||
      (options.endingBefore &&
        Math.max(1, parseInt(options.endingBefore) - 1)) ||
      1;
    const limit = options.limit || 10;

    const customersPage = await polar.customers.list({
      limit,
      page: targetPage,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        customersPage.result.items,
        targetPage,
        customersPage.result.pagination.maxPage,
        mapPolarCustomerToCustomer,
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
