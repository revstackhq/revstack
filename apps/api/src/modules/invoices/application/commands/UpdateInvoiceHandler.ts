import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateInvoiceCommand } from "@/modules/invoices/application/commands/UpdateInvoiceCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class UpdateInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: UpdateInvoiceCommand) {
    const invoice = await this.repository.findById(command.id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    if (command.dueDate) invoice.dueDate = new Date(command.dueDate);
    if (command.status) invoice.status = command.status;

    await this.repository.save(invoice);
    await this.eventBus.publish({ eventName: "invoice.updated", id: invoice.id, customerId: invoice.customerId });

    return { success: true };
  }
}
