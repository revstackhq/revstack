import type { IPaymentRepository } from "@/modules/invoices/application/ports/IPaymentRepository";
import type { IInvoiceRepository } from "@/modules/invoices/application/ports/IInvoiceRepository";
import type { IEventBus } from "@/common/application/ports/IEventBus";
import type { ProcessPaymentCommand } from "@/modules/invoices/application/commands/ProcessPaymentCommand";
import { PaymentEntity } from "@/modules/invoices/domain/PaymentEntity";
import { PaymentProcessedEvent } from "@/modules/invoices/domain/events/InvoiceEvents";
import { InvoiceNotFoundError } from "@/modules/invoices/domain/InvoiceErrors";

/**
 * Command Handler for processing payments against draft invoices.
 * Responsible for verifying the invoice exists, persisting the new payment,
 * updating the invoice status if fully paid, and emitting a domain event.
 */
export class ProcessPaymentHandler {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly invoiceRepo: IInvoiceRepository,
    private readonly eventBus: IEventBus
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
