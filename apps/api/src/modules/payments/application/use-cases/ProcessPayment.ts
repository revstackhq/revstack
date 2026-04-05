import { z } from "zod";
import type { PaymentRepository } from "@revstackhq/core";
import type { InvoiceRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PaymentEntity } from "@revstackhq/core";
import { PaymentProcessedEvent } from "@revstackhq/core";
import { InvoiceNotFoundError } from "@revstackhq/core";

export const processPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.string().min(1, "Payment method is required"),
  idempotencyKey: z.string().optional(),
});

export type ProcessPaymentCommand = z.infer<typeof processPaymentSchema>;

/**
 * Command Handler for processing payments against draft invoices.
 * Responsible for verifying the invoice exists, persisting the new payment,
 * updating the invoice status if fully paid, and emitting a domain event.
 */
export class ProcessPaymentHandler {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: ProcessPaymentCommand): Promise<string> {
    const invoice = await this.invoiceRepo.findById(command.invoiceId);
    if (!invoice) {
        throw new InvoiceNotFoundError(command.invoiceId);
    }

    const payment = PaymentEntity.process(command.invoiceId, command.amount, command.method);
    await this.paymentRepo.save(payment);

    // Business Logic: If payment covers invoice, mark invoice as paid
    if (payment.amount >= invoice.totalAmount) {
        invoice.markAsPaid();
        await this.invoiceRepo.save(invoice);
    }

    await this.eventBus.publish(new PaymentProcessedEvent(payment.id, payment.invoiceId));

    return payment.id;
  }
}
