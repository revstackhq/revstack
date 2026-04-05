import { z } from "zod";
import type { RefundRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export const updateRefundSchema = z.object({
  status: z.enum(["pending", "succeeded", "failed"]),
});

export type UpdateRefundCommand = {
  id: string;
} & z.infer<typeof updateRefundSchema>;

export class UpdateRefundHandler {
  constructor(
    private readonly repository: RefundRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateRefundCommand) {
    const refund = await this.repository.findById(command.id);
    if (!refund) {
      throw new NotFoundError("Refund not found", "REFUND_NOT_FOUND");
    }

    if (command.status === "succeeded") {
      refund.markAsSucceeded();
    } else if (command.status === "failed") {
      refund.markAsFailed();
    }

    await this.repository.save(refund);
    await this.eventBus.publish({ eventName: `refund.${refund.status}`, id: refund.id, paymentId: refund.paymentId });

    return { success: true };
  }
}
