import { toCustomer } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  Customer,
  AsyncActionResult,
  PaginatedResult,
  buildCursorPagination,
  ListCustomersOptions,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Fetches a paginated list of customers from the provider.
 * Translates Revstack cursor positions into provider-native pagination parameters.
 *
 * @param ctx - The provider context instance.
 * @param options - Pagination bounds and optional search filters.
 * @returns An AsyncActionResult wrapping a bidirectional PaginatedResult of customers.
 */
export async function listCustomers(
  ctx: ProviderContext,
  options: ListCustomersOptions,
): Promise<AsyncActionResult<PaginatedResult<Customer>>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customers = await stripe.customers.list({
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
        customers.data,
        customers.has_more,
        options,
        toCustomer,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
