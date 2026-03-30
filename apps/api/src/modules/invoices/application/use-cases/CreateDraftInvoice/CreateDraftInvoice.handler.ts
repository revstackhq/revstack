import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { CreateDraftInvoiceCommand } from "./CreateDraftInvoice.schema";
import { InvoiceEntity } from "@/modules/invoices/domain/InvoiceEntity";
import { InvoiceCreatedEvent } from "@/modules/invoices/domain/events/InvoiceEvents";

export class CreateDraftInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService
  ) {}

  public async execute(command: CreateDraftInvoiceCommand): Promise<string> {
    const dueDate = command.dueDate ? new Date(command.dueDate) : undefined;
    const invoice = InvoiceEntity.createDraft(command.customerId, command.currency, dueDate);

    await this.repository.save(invoice);
    await this.cache.invalidate("invoices_list");
    await this.eventBus.publish(new InvoiceCreatedEvent(invoice.id, invoice.customerId));

    return invoice.id;
  }
}
