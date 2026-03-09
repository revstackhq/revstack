import { toSubscription } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  Subscription,
  AsyncActionResult,
  PaginatedResult,
  buildCursorPagination,
  ListSubscriptionsOptions,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Fetches a paginated list of subscriptions from the provider.
 * Translates Revstack cursor positions into provider-native pagination parameters.
 *
 * @param ctx - The provider context.
 * @param options - Pagination bounds and optional filters.
 * @returns An AsyncActionResult wrapping a bidirectional PaginatedResult of subscriptions.
 */
export async function listSubscriptions(
  ctx: ProviderContext,
  options: ListSubscriptionsOptions,
): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const subs = await stripe.subscriptions.list({
      limit: options.limit ?? 10,
      starting_after:
        options.cursor && options.direction !== "backward"
          ? options.cursor
          : undefined,
      ending_before:
        options.cursor && options.direction === "backward"
          ? options.cursor
          : undefined,
      ...options.filters,
    });

    return {
      data: buildCursorPagination(
        subs.data,
        subs.has_more,
        options,
        toSubscription,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
