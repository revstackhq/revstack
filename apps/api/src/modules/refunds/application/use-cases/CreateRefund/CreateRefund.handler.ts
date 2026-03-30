import type { RefundRepository } from "@/modules/refunds/application/ports/RefundRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateRefundCommand } from "./CreateRefund.schema";
import { RefundEntity } from "@/modules/refunds/domain/RefundEntity";

export class CreateRefundHandler {
  constructor(
    private readonly repository: RefundRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateRefundCommand) {
    const refund = RefundEntity.create(
      command.paymentId,
      command.amount,
      command.reason
    );

    // Depending on integration logic, we might need an actual payment provider integration here.

    await this.repository.save(refund);
    await this.eventBus.publish({ eventName: "refund.created", id: refund.id, paymentId: refund.paymentId });

    return { id: refund.id, status: refund.status };
  }
}
