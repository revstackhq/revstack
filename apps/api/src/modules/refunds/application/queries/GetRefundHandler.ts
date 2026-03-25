import type { RefundRepository } from "@/modules/refunds/application/ports/RefundRepository";
import type { GetRefundQuery } from "@/modules/refunds/application/queries/GetRefundQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetRefundHandler {
  constructor(private readonly repository: RefundRepository) {}

  public async handle(query: GetRefundQuery) {
    const refund = await this.repository.findById(query.id);
    if (!refund) {
      throw new NotFoundError("Refund not found", "REFUND_NOT_FOUND");
    }
    return refund;
  }
}
