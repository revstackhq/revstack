import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export interface VoidInvoiceCommand {
  id: string;
}

export class VoidInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: VoidInvoiceCommand) {
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
