import { ProviderContext } from "@/context";
import {
  AddInvoiceItemInput,
  CreateInvoiceInput,
  GetInvoiceInput,
  Invoice,
  ListInvoicesOptions,
} from "@/types/invoices";
import { AsyncActionResult, PaginatedResult } from "@/types/shared";

export interface IInvoiceFeature {
  /**
   * Injects a pending line item (e.g., an overage charge) into a draft or upcoming invoice.
   * Required when `billing.invoiceItems` is true.
   * * @param ctx - The provider execution context.
   * @param input - The line item details including amount, description, and target customer/subscription.
   * @returns An AsyncActionResult containing the ID of the created invoice item.
   */
  addInvoiceItem?(
    ctx: ProviderContext,
    input: AddInvoiceItemInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Triggers the generation of an invoice.
   * This method aggregates any "Pending Invoice Items" (overages) into a formalized document.
   * * @param ctx - The provider execution context.
   * @param input - Declarative billing instructions.
   * @returns An AsyncActionResult containing the invoice id.
   */
  createInvoice?(
    ctx: ProviderContext,
    input: CreateInvoiceInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Retrieves a specific formalized invoice.
   * Primarily used for downloading PDF receipts or auditing past billing cycles.
   * * @param ctx - The provider execution context.
   * @param input - The ID of the invoice to retrieve.
   * @returns An AsyncActionResult containing the normalized Invoice entity.
   */
  getInvoice?(
    ctx: ProviderContext,
    input: GetInvoiceInput,
  ): Promise<AsyncActionResult<Invoice>>;

  /**
   * Retrieves a paginated list of historical invoices for a customer or organization.
   * * @param ctx - The provider execution context.
   * @param options - Pagination and filtering parameters.
   * @returns An AsyncActionResult containing a paginated array of Invoices.
   */
  listInvoices?(
    ctx: ProviderContext,
    options: ListInvoicesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Invoice>>>;
}
