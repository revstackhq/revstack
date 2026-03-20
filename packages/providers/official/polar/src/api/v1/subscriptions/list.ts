import { getOrCreateClient } from "@/api/v1/client";
import { mapPolarSubscriptionToSubscription } from "@/api/v1/subscriptions/mapper";
import {
  AsyncActionResult,
  PaginatedResult,
  ProviderContext,
  Subscription,
  buildPagePagination,
  ListSubscriptionsOptions,
} from "@revstackhq/providers-core";
import { mapError } from "@/shared/error-map";

/**
 * Lists multiple paginated subscriptions dynamically correctly.
 *
 * @param ctx - The provider context.
 * @param options - Pagination boundaries and filters.
 * @returns A paginated array of mapped subscriptions.
 */
export async function listSubscriptions(
  ctx: ProviderContext,
  options: ListSubscriptionsOptions,
): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
  try {
    const polar = getOrCreateClient(ctx);
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;

    const response = await polar.subscriptions.list({
      limit,
      page,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        response.result.items,
        page,
        response.result.pagination.maxPage,
        mapPolarSubscriptionToSubscription,
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
}
