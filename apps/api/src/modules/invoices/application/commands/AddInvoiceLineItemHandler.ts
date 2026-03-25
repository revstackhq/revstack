import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { AddInvoiceLineItemCommand } from "@/modules/invoices/application/commands/AddInvoiceLineItemCommand";
import { InvoiceLineItemEntity } from "@/modules/invoices/domain/InvoiceLineItemEntity";
import { NotFoundError, DomainError } from "@/common/errors/DomainError";

export class AddInvoiceLineItemHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: AddInvoiceLineItemCommand) {
    const invoice = await this.repository.findById(command.invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    if (invoice.status !== "draft") {
      throw new DomainError("Can only add line items to draft invoices", 400, "INVALID_STATE");
    }

    const lineItem = InvoiceLineItemEntity.create(
      command.invoiceId,
      command.name,
      new Date(command.periodStart),
      new Date(command.periodEnd),
      command.amount,
      command.currency,
      command.quantity
    );

    await this.repository.saveLineItem(lineItem);
    
    // Update invoice total amount here if necessary
    invoice.totalAmount += (lineItem.amount * lineItem.quantity);
    await this.repository.save(invoice);

    await this.eventBus.publish({ eventName: "invoice_line.created", id: lineItem.id, invoiceId: invoice.id });

    return { id: lineItem.id };
  }
}
