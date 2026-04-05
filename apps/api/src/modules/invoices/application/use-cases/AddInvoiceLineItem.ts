import { z } from "zod";
import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { InvoiceLineItemEntity } from "@revstackhq/core";
import { NotFoundError, DomainError } from "@revstackhq/core";
import { InvoiceLineItemCreatedEvent } from "@revstackhq/core";

export const addInvoiceLineItemSchema = z.object({
  name: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  amount: z.number().int(),
  currency: z.string().length(3),
  quantity: z.number().int().min(1).default(1),
});

export type AddInvoiceLineItemCommand = {
  invoiceId: string;
} & z.infer<typeof addInvoiceLineItemSchema>;

export class AddInvoiceLineItemHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: AddInvoiceLineItemCommand) {
    const invoice = await this.repository.findById(command.invoiceId);
    if (!invoice) {
      throw new NotFoundError("Invoice not found", "INVOICE_NOT_FOUND");
    }

    if (invoice.val.status !== "draft") {
      throw new DomainError(
        "Can only add line items to draft invoices",
        400,
        "INVALID_STATE",
      );
    }

    const lineItem = InvoiceLineItemEntity.create({
      invoiceId: command.invoiceId,
      name: command.name,
      periodStart: new Date(command.periodStart),
      periodEnd: new Date(command.periodEnd),
      amount: command.amount,
      currency: command.currency,
      quantity: command.quantity,
    });

    await this.repository.saveLineItem(lineItem);

    invoice.addAmount(lineItem.val.amount * lineItem.val.quantity);

    await this.repository.save(invoice);

    await this.eventBus.publish(
      new InvoiceLineItemCreatedEvent({
        id: lineItem.val.id!,
        invoiceId: lineItem.val.invoiceId,
        occurredAt: new Date(),
      }),
    );

    return { id: lineItem.val.id };
  }
}
