import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteInvoiceLineItemCommand } from "@/modules/invoices/application/commands/DeleteInvoiceLineItemCommand";
import { NotFoundError, DomainError } from "@/common/errors/DomainError";

export class DeleteInvoiceLineItemHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: DeleteInvoiceLineItemCommand) {
    const invoice = await this.repository.findById(command.invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    if (invoice.status !== "draft") {
      throw new DomainError("Can only modify draft invoices", 400, "INVALID_STATE");
    }

    const lineItem = await this.repository.findLineItemById(command.lineId);
    if (!lineItem || lineItem.invoiceId !== command.invoiceId) {
      throw new NotFoundError("Line item not found", "LINE_ITEM_NOT_FOUND");
    }

    const itemTotal = lineItem.amount * lineItem.quantity;

    await this.repository.deleteLineItem(command.lineId);
    
    invoice.totalAmount -= itemTotal;
    await this.repository.save(invoice);

    await this.eventBus.publish({ eventName: "invoice_line.deleted", id: command.lineId, invoiceId: invoice.id });

    return { success: true };
  }
}
