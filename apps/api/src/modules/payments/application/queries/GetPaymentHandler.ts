import type { PaymentRepository } from "@/modules/payments/application/ports/PaymentRepository";
import type { GetPaymentQuery } from "@/modules/payments/application/queries/GetPaymentQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetPaymentHandler {
  constructor(private readonly repository: PaymentRepository) {}

  public async handle(query: GetPaymentQuery) {
    const payment = await this.repository.findById(query.id);
    if (!payment) {
      throw new NotFoundError("Payment not found", "PAYMENT_NOT_FOUND");
    }
    return payment;
  }
}
