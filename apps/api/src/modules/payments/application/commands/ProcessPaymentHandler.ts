import type { PaymentRepository } from "@/modules/payments/application/ports/PaymentRepository";
import type { InvoiceRepository } from "@/modules/invoices/application/ports/InvoiceRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { ProcessPaymentCommand } from "@/modules/payments/application/commands/ProcessPaymentCommand";
import { PaymentEntity } from "@/modules/payments/domain/PaymentEntity";
import { PaymentProcessedEvent } from "@/modules/invoices/domain/events/InvoiceEvents";
import { InvoiceNotFoundError } from "@/modules/invoices/domain/InvoiceErrors";

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

  public async handle(command: ProcessPaymentCommand): Promise<string> {
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
