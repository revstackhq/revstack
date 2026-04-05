import { z } from "zod";
import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export const updateInvoiceSchema = z.object({
  dueDate: z.string().datetime().optional(),
  status: z.enum(["draft", "open", "paid", "void", "uncollectible"]).optional(),
});

export type UpdateInvoiceCommand = {
  id: string;
} & z.infer<typeof updateInvoiceSchema>;

export class UpdateInvoiceHandler {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateInvoiceCommand) {
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
