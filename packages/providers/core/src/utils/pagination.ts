import { PaginatedResult, PaginationOptions } from "@/types/shared";

/**
 * Builds a standardized cursor-based pagination result.
 * Automatically resolves `hasMore` and `hasPrevious` based on the query direction,
 * keeping the Core completely agnostic of provider-specific cursor names.
 *
 * @param items - The raw array of items returned by the provider.
 * @param providerHasMore - The native 'has_more' boolean returned by the provider.
 * @param pagination - The original pagination options requested by the Core.
 * @param mapperFn - The function to map the raw provider item to the Revstack domain model.
 * @returns A strictly typed PaginatedResult.
 */
export function buildCursorPagination<T extends { id: string }, U>(
  items: T[],
  providerHasMore: boolean,
  pagination: PaginationOptions,
  mapperFn: (item: T) => U,
): PaginatedResult<U> {
  // Default direction is always 'forward' unless explicitly stated
  const isForward = !pagination.direction || pagination.direction === "forward";
  const isBackward = pagination.direction === "backward";
  const hasCursor = !!pagination.cursor;

  /**
   * STANDARD LOGIC:
   * - If moving forward WITH a cursor, we know there is a previous page.
   * - If moving backward, the provider's `hasMore` actually means "has previous".
   */
  const hasPrevious =
    (isForward && hasCursor) || (isBackward && providerHasMore);

  /**
   * - If moving forward, the provider's `hasMore` means "has next".
   * - If moving backward WITH a cursor, we know there is a next page (the one we just came from).
   */
  const hasMore = (isForward && providerHasMore) || (isBackward && hasCursor);

  return {
    data: items.map(mapperFn),
    hasMore,
    nextCursor: items.at(-1)?.id,
    hasPrevious,
    previousCursor: items.at(0)?.id,
  };
}

/**
 * Builds a standardized offset-based (page) pagination result.
 * Ideal for legacy providers or APIs that do not support cursor pagination.
 *
 * @param items - The raw array of items.
 * @param targetPage - The page number that was requested.
 * @param maxPage - The total number of pages available (if known by the provider).
 * @param mapperFn - The mapping function.
 * @returns A strictly typed PaginatedResult.
 */
export function buildPagePagination<T, U>(
  items: T[],
  targetPage: number,
  maxPage: number,
  mapperFn: (item: T) => U,
): PaginatedResult<U> {
  return {
    data: items.map(mapperFn),
    hasMore: targetPage < maxPage,
    // Safely cast to string to match the universal cursor signature
    nextCursor: targetPage < maxPage ? (targetPage + 1).toString() : undefined,
    hasPrevious: targetPage > 1,
    previousCursor: targetPage > 1 ? (targetPage - 1).toString() : undefined,
  };
}
