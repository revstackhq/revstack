import type { PaymentRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetPaymentQuery {
  id: string;
}

export class GetPaymentHandler {
  constructor(private readonly repository: PaymentRepository) {}

  public async execute(query: GetPaymentQuery) {
    const payment = await this.repository.findById(query.id);
    if (!payment) {
      throw new NotFoundError("Payment not found", "PAYMENT_NOT_FOUND");
    }
    return payment;
  }
}
