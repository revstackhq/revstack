import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CouponRepository } from "@revstackhq/core";
import { CouponNotFoundError } from "@revstackhq/core";

export const IncrementCouponRedemptionCommandSchema = z.object({
  id_or_code: z.string().min(1),
  environment_id: z.string().min(1),
});

export type IncrementCouponRedemptionCommand = z.infer<
  typeof IncrementCouponRedemptionCommandSchema
>;

export const IncrementCouponRedemptionResponseSchema = z.object({
  success: z.boolean(),
  redemptions_count: z.number(),
});

export type IncrementCouponRedemptionResponse = z.infer<
  typeof IncrementCouponRedemptionResponseSchema
>;

export class IncrementCouponRedemptionHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: IncrementCouponRedemptionCommand,
  ): Promise<IncrementCouponRedemptionResponse> {
    const isId = command.id_or_code.startsWith("cou_");

    let coupon;

    if (isId) {
      coupon = await this.repository.findById({
        id: command.id_or_code,
        environmentId: command.environment_id,
      });
    } else {
      coupon = await this.repository.findByCode({
        code: command.id_or_code,
        environmentId: command.environment_id,
      });
    }

    if (!coupon) {
      throw new CouponNotFoundError(command.id_or_code);
    }

    coupon.incrementRedemption();

    await this.repository.save(coupon);
    await this.eventBus.publish(coupon.pullEvents());

    return {
      success: true,
      redemptions_count: coupon.val.redemptionsCount,
    };
  }
}
