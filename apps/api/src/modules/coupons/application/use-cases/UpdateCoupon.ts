import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CouponRepository } from "@revstackhq/core";
import { CouponNotFoundError } from "@revstackhq/core";

export const UpdateCouponCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  metadata: z.record(z.unknown()).optional(),
  max_redemptions: z.number().int().optional(),
  expires_at: z.coerce.date().optional(),
});

export type UpdateCouponCommand = z.infer<typeof UpdateCouponCommandSchema>;

export const UpdateCouponResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  code: z.string(),
  type: z.string(),
  amount: z.number(),
  currency: z.string().optional(),
  duration: z.string(),
  duration_in_months: z.number().optional(),
  max_redemptions: z.number().optional(),
  redemptions_count: z.number(),
  restricted_plan_ids: z.array(z.string()),
  is_first_time_only: z.boolean(),
  status: z.string(),
  metadata: z.record(z.unknown()),
  expires_at: z.date().optional(),
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
    const coupon = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!coupon) {
      throw new CouponNotFoundError(command.id);
    }

    coupon.update({
      status: command.status,
      metadata: command.metadata,
      maxRedemptions: command.max_redemptions,
      expiresAt: command.expires_at,
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
      currency: v.currency,
      duration: v.duration,
      duration_in_months: v.durationInMonths,
      max_redemptions: v.maxRedemptions,
      redemptions_count: v.redemptionsCount,
      restricted_plan_ids: v.restrictedPlanIds,
      is_first_time_only: v.isFirstTimeOnly,
      status: v.status,
      metadata: v.metadata ?? {},
      expires_at: v.expiresAt,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
