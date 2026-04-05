import { DomainError } from "@/domain/base/DomainError";

export class PaymentNotFoundError extends DomainError {
  constructor() {
    super("Payment not found", 404, "PAYMENT_NOT_FOUND");
  }
}

export class PaymentFailedError extends DomainError {
  constructor(reason: string) {
    super(`Payment failed: ${reason}`, 422, "PAYMENT_FAILED");
  }
}
