import { z } from "zod";
import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError, DomainError } from "@revstackhq/core";

export const updateInvoiceLineItemSchema = z.object({
  name: z.string().optional(),
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
  amount: z.number().int().optional(),
  quantity: z.number().int().min(1).optional(),
});

export type UpdateInvoiceLineItemCommand = {
  invoiceId: string;
  lineId: string;
} & z.infer<typeof updateInvoiceLineItemSchema>;

export class UpdateInvoiceLineItemHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateInvoiceLineItemCommand) {
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

    const originalTotal = lineItem.amount * lineItem.quantity;

    lineItem.update({
      name: command.name,
      periodStart: command.periodStart ? new Date(command.periodStart) : undefined,
      periodEnd: command.periodEnd ? new Date(command.periodEnd) : undefined,
      amount: command.amount,
      quantity: command.quantity,
    });

    const newTotal = lineItem.amount * lineItem.quantity;

    await this.repository.saveLineItem(lineItem);

    if (originalTotal !== newTotal) {
      invoice.totalAmount = invoice.totalAmount - originalTotal + newTotal;
      await this.repository.save(invoice);
    }

    await this.eventBus.publish({ eventName: "invoice_line.updated", id: lineItem.id, invoiceId: invoice.id });

    return { success: true };
  }
}
