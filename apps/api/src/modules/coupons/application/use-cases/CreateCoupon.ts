import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CouponRepository } from "@revstackhq/core";
import { CouponEntity } from "@revstackhq/core";

export const CreateCouponCommandSchema = z.object({
  environment_id: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(["fixed_amount", "percentage"]),
  amount: z.number().min(0),
  currency: z.string().optional(),
  duration: z.enum(["forever", "once", "repeating"]),
  duration_in_months: z.number().int().optional(),
  max_redemptions: z.number().int().optional(),
  restricted_plan_ids: z.array(z.string()).optional(),
  is_first_time_only: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
  expires_at: z.coerce.date().optional(),
});

export type CreateCouponCommand = z.infer<typeof CreateCouponCommandSchema>;

export const CreateCouponResponseSchema = z.object({
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

export type CreateCouponResponse = z.infer<typeof CreateCouponResponseSchema>;

export class CreateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateCouponCommand,
  ): Promise<CreateCouponResponse> {
    const coupon = CouponEntity.create({
      environmentId: command.environment_id,
      code: command.code,
      type: command.type,
      amount: command.amount,
      currency: command.currency,
      duration: command.duration,
      durationInMonths: command.duration_in_months,
      maxRedemptions: command.max_redemptions,
      restrictedPlanIds: command.restricted_plan_ids ?? [],
      isFirstTimeOnly: command.is_first_time_only ?? false,
      metadata: command.metadata,
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
