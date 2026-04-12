import { BadRequestError } from "@/domain/base/DomainError";

export class RefundDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "RefundDomainError";
  }
}

export class InvalidRefundStatusError extends RefundDomainError {
  constructor(currentStatus: string) {
    super(
      `Refund cannot be processed in its current state: ${currentStatus}`,
      "INVALID_REFUND_STATUS",
    );
  }
}

export class InvalidRefundAmountError extends RefundDomainError {
  constructor(amount: number) {
    super(
      `Refund amount must be positive. Received: ${amount}`,
      "INVALID_REFUND_AMOUNT",
    );
  }
}
