import type { PaymentRepository } from "@/modules/payments/application/ports/PaymentRepository";
import type { ListPaymentsQuery } from "@/modules/payments/application/queries/ListPaymentsQuery";

export class ListPaymentsHandler {
  constructor(private readonly repository: PaymentRepository) {}

  public async handle(query: ListPaymentsQuery) {
    const payments = await this.repository.find({
      invoiceId: query.invoiceId,
      status: query.status,
    });
    return payments;
  }
}
