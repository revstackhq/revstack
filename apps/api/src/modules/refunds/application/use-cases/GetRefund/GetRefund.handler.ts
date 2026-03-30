import type { RefundRepository } from "@/modules/refunds/application/ports/RefundRepository";
import type { GetRefundQuery } from "./GetRefund.schema";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetRefundHandler {
  constructor(private readonly repository: RefundRepository) {}

  public async execute(query: GetRefundQuery) {
    const refund = await this.repository.findById(query.id);
    if (!refund) {
      throw new NotFoundError("Refund not found", "REFUND_NOT_FOUND");
    }
    return refund;
  }
}
