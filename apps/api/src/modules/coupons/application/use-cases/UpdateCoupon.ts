import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CouponNotFoundError } from "@revstackhq/core";

export const UpdateCouponCommandSchema = z.object({
  status: z.enum(["active", "inactive", "archived"]).optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateCouponCommand = {
  coupon_id: string;
} & z.infer<typeof UpdateCouponCommandSchema>;

export const UpdateCouponResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  code: z.string(),
  type: z.string(),
  amount: z.number(),
  status: z.string(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type UpdateCouponResponse = z.infer<typeof UpdateCouponResponseSchema>;

export class UpdateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: UpdateCouponCommand,
  ): Promise<UpdateCouponResponse> {
    const coupon = await this.repository.findById(command.coupon_id);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

    coupon.update({
      status: command.status,
      metadata: command.metadata,
    });

    await this.repository.save(coupon);

    await this.eventBus.publish(coupon.pullEvents());

    const v = coupon.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      code: v.code,
      type: v.type,
      amount: v.amount,
      status: v.status,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
