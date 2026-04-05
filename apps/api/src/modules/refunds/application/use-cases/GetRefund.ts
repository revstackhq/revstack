import type { RefundRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetRefundQuery {
  id: string;
}

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
