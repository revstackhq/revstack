import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  GetInvoiceInput,
  Invoice,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { toInvoice } from "@/api/v1/invoices/mapper";

/**
 * Retrieves a specific invoice by its external ID.
 *
 * @param ctx - The provider execution context.
 * @param input - Contains the invoice ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Invoice entity.
 */
export async function getInvoice(
  ctx: ProviderContext,
  input: GetInvoiceInput,
): Promise<AsyncActionResult<Invoice>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const invoice = await stripe.invoices.retrieve(input.id);

    return { data: toInvoice(invoice), status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
