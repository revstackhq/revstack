import type { RefundRepository } from "@/modules/refunds/application/ports/RefundRepository";
import type { ListRefundsQuery } from "@/modules/refunds/application/queries/ListRefundsQuery";

export class ListRefundsHandler {
  constructor(private readonly repository: RefundRepository) {}

  public async handle(query: ListRefundsQuery) {
    const refunds = await this.repository.find({
      paymentId: query.paymentId,
      status: query.status,
    });
    return refunds;
  }
}
