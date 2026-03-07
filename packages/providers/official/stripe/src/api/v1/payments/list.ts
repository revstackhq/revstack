import { toPayment } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  Payment,
  AsyncActionResult,
  PaginatedResult,
  buildCursorPagination,
  ListPaymentsOptions,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

/**
 * Fetches a paginated list of payments from the provider.
 * Expands charge data to guarantee correct capture status and receipt mapping.
 * Translates Revstack cursor positions into provider-native pagination parameters.
 *
 * @param ctx - The provider context instance.
 * @param options - Pagination bounds and optional filters.
 * @returns An AsyncActionResult wrapping a bidirectional PaginatedResult of payments.
 */
export async function listPayments(
  ctx: ProviderContext,
  options: ListPaymentsOptions,
): Promise<AsyncActionResult<PaginatedResult<Payment>>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    const params: Stripe.PaymentIntentListParams = {
      limit: options.limit || 20,
      expand: ["data.latest_charge"],
      ...options.filters,
    };

    if (options.cursor) {
      params.starting_after = options.cursor;
    } else if (options.startingAfter) {
      params.starting_after = options.startingAfter;
    } else if (options.endingBefore) {
      params.ending_before = options.endingBefore;
    }

    const result = await stripe.paymentIntents.list(params);
    return {
      data: buildCursorPagination(
        result.data,
        result.has_more,
        options,
        toPayment,
      ),
      status: "success",
    };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: null, status: "failed", error: mapped };
  }
}
