import type { InvoiceRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetInvoiceQuery {
  id: string;
}

export class GetInvoiceHandler {
  constructor(private readonly repository: InvoiceRepository) {}

  public async execute(query: GetInvoiceQuery) {
    const invoice = await this.repository.findById(query.id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }
    return invoice;
  }
}
