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
    const targetPage =
      options.page ||
      (options.startingAfter && parseInt(options.startingAfter) + 1) ||
      (options.endingBefore &&
        Math.max(1, parseInt(options.endingBefore) - 1)) ||
      1;

    const subsResponse = await polar.subscriptions.list({
      organizationId: ctx.config.organizationId,
      limit: options.limit || 10,
      page: targetPage,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        subsResponse.result.items,
        targetPage,
        subsResponse.result.pagination.maxPage,
        mapPolarSubscriptionToSubscription,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
