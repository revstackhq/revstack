import { z } from "zod";
import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import { InvoiceEntity } from "@revstackhq/core";
import { InvoiceCreatedEvent } from "@revstackhq/core";

export const createInvoiceSchema = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  currency: z.string().length(3).default("USD"),
  due_date: z.string().datetime().optional(),
  idempotency_key: z.string().optional(),
  environment_id: z.string(),
});

export type CreateDraftInvoiceCommand = z.infer<typeof createInvoiceSchema>;

export class CreateDraftInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService,
  ) {}

  public async execute(command: CreateDraftInvoiceCommand): Promise<string> {
    const dueDate = command.due_date ? new Date(command.due_date) : undefined;

    const invoice = InvoiceEntity.createDraft(
      command.customer_id,
      command.currency,
      dueDate,
    );

    await this.repository.save(invoice);
    await this.cache.deletePrefix(
      `env:${command.environment_id}:invoices_list:${command.customer_id}:*`,
    );

    await this.eventBus.publish(
      new InvoiceCreatedEvent({
        id: invoice.val.id!,
        customerId: invoice.val.customerId,
        environmentId: command.environment_id,
        occurredAt: new Date(),
      }),
    );

    return invoice.val.id!;
  }
}
