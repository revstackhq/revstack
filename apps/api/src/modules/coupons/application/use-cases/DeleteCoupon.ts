import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CouponNotFoundError } from "@revstackhq/core";

export const DeleteCouponCommandSchema = z.object({
  id: z.string().min(1),
});

export type DeleteCouponCommand = z.infer<typeof DeleteCouponCommandSchema>;

export const DeleteCouponResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteCouponResponse = z.infer<typeof DeleteCouponResponseSchema>;

export class DeleteCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: DeleteCouponCommand,
  ): Promise<DeleteCouponResponse> {
    const coupon = await this.repository.findById(command.id);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    await this.repository.delete(command.id);

    await this.eventBus.publish(coupon.pullEvents());

    return { success: true };
  }
}
