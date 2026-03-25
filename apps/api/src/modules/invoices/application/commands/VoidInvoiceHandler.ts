import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { VoidInvoiceCommand } from "@/modules/invoices/application/commands/VoidInvoiceCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class VoidInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: VoidInvoiceCommand) {
    const invoice = await this.repository.findById(command.id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    invoice.markAsVoid();

    await this.repository.save(invoice);
    await this.eventBus.publish({ eventName: "invoice.voided", id: invoice.id, customerId: invoice.customerId });

    return { success: true };
  }
}
