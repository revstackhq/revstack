import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { GetInvoiceQuery } from "@/modules/invoices/application/queries/GetInvoiceQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetInvoiceHandler {
  constructor(private readonly repository: InvoiceRepository) {}

  public async handle(query: GetInvoiceQuery) {
    const invoice = await this.repository.findById(query.id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }
    return invoice;
  }
}
