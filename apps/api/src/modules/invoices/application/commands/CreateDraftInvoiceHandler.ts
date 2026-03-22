import type { IInvoiceRepository } from "@/modules/invoices/application/ports/IInvoiceRepository";
import type { IEventBus } from "@/modules/invoices/application/ports/IEventBus";
import type { ICacheService } from "@/modules/invoices/application/ports/ICacheService";
import type { CreateDraftInvoiceCommand } from "@/modules/invoices/application/commands/CreateDraftInvoiceCommand";
import { InvoiceEntity } from "@/modules/invoices/domain/InvoiceEntity";
import { InvoiceCreatedEvent } from "@/modules/invoices/domain/events/InvoiceEvents";

export class CreateDraftInvoiceHandler {
  constructor(
    private readonly repository: IInvoiceRepository,
    private readonly eventBus: IEventBus,
    private readonly cache: ICacheService
  ) {}

  public async handle(command: CreateDraftInvoiceCommand): Promise<string> {
    const dueDate = command.dueDate ? new Date(command.dueDate) : undefined;
    const invoice = InvoiceEntity.createDraft(command.customerId, command.currency, dueDate);

    await this.repository.save(invoice);
    await this.cache.invalidate("invoices_list");
    await this.eventBus.publish(new InvoiceCreatedEvent(invoice.id, invoice.customerId));

    return invoice.id;
  }
}
