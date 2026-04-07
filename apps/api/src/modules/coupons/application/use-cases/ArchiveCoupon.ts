import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CouponRepository } from "@revstackhq/core";
import { CouponNotFoundError } from "@revstackhq/core";

export const ArchiveCouponCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type ArchiveCouponCommand = z.infer<typeof ArchiveCouponCommandSchema>;

export const ArchiveCouponResponseSchema = z.object({
  success: z.boolean(),
});

export type ArchiveCouponResponse = z.infer<typeof ArchiveCouponResponseSchema>;

export class ArchiveCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: ArchiveCouponCommand,
  ): Promise<ArchiveCouponResponse> {
    const coupon = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!coupon) {
      throw new CouponNotFoundError(command.id);
    }

    coupon.archive();

    await this.repository.save(coupon);
    await this.eventBus.publish(coupon.pullEvents());

    return {
      success: true,
    };
  }
}
