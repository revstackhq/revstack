import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError, DomainError } from "@revstackhq/core";

export interface FinalizeInvoiceCommand {
  id: string;
}

export class FinalizeInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: FinalizeInvoiceCommand) {
    const invoice = await this.repository.findById(command.id);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    if (invoice.status !== "draft") {
      throw new DomainError("Only draft invoices can be finalized", 400, "INVALID_STATE");
    }

    invoice.status = "open";

    await this.repository.save(invoice);
    await this.eventBus.publish({ eventName: "invoice.finalized", id: invoice.id, customerId: invoice.customerId });

    return { success: true };
  }
}
