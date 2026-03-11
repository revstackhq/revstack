import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  AddInvoiceItemInput,
  AsyncActionResult,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Injects a pending one-off line item into a customer's upcoming invoice.
 * Used for the overage billing pattern where charges are appended to a draft invoice.
 *
 * @param ctx - The provider execution context.
 * @param input - The customer ID, amount, currency, and description for the line item.
 * @returns An AsyncActionResult yielding the created invoice item ID.
 */
export async function addInvoiceItem(
  ctx: ProviderContext,
  input: AddInvoiceItemInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    const item = await polar.invoiceItems.create(
      {
        customer: input.customerId,
        amount: input.amount,
        currency: normalizeCurrency(input.currency, "lowercase"),
        description: input.description,
        subscription: input.subscriptionId,
        metadata: input.metadata as Record<string, string> | undefined,
      },
      { idempotencyKey: ctx.idempotencyKey },
    );

    return { data: item.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
