import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  ListInvoicesOptions,
  Invoice,
  AsyncActionResult,
  PaginatedResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toInvoice } from "@/api/v1/invoices/mapper";

/**
 * Lists invoices with cursor-based pagination and optional filters.
 *
 * @param ctx - The provider execution context.
 * @param options - Pagination and filtering options (customerId, subscriptionId, status).
 * @returns An AsyncActionResult containing a paginated list of Invoice entities.
 */
export async function listInvoices(
  ctx: ProviderContext,
  options: ListInvoicesOptions,
): Promise<AsyncActionResult<PaginatedResult<Invoice>>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const limit = options.limit ?? 10;

    const list = await polar.invoices.list({
      limit,
      customer: options.customerId,
      subscription: options.subscriptionId,
      status: options.status,
      starting_after: options.startingAfter,
      ending_before: options.endingBefore,
    });

    const data = list.data.map(toInvoice);
    const lastItem = data[data.length - 1];

    return {
      data: {
        data,
        hasMore: list.has_more,
        nextCursor: list.has_more && lastItem ? lastItem.id : undefined,
      },
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
