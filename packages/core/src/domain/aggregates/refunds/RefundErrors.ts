import { DomainError } from "@/domain/base/DomainError";

export class RefundNotFoundError extends DomainError {
  constructor() {
    super("Refund not found", 404, "REFUND_NOT_FOUND");
  }
}
