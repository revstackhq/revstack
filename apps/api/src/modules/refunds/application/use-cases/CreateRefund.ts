import { z } from "zod";
import type { RefundRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { RefundEntity } from "@revstackhq/core";

export const createRefundSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export type CreateRefundCommand = {
  paymentId: string;
} & z.infer<typeof createRefundSchema>;

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
