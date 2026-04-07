import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";

export const ValidateCouponCommandSchema = z.object({
  environment_id: z.string().min(1),
  code: z.string().min(1),
  plan_id: z.string().optional(),
  is_first_time: z.boolean().default(false),
});

export type ValidateCouponCommand = z.infer<typeof ValidateCouponCommandSchema>;

export const CouponResponseSchema = z.object({
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

export const ValidateCouponResponseSchema = z.object({
  valid: z.boolean(),
  reason: z.string().optional(),
  coupon: CouponResponseSchema.optional(),
});

export type ValidateCouponResponse = z.infer<
  typeof ValidateCouponResponseSchema
>;

export class ValidateCouponHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(
    command: ValidateCouponCommand,
  ): Promise<ValidateCouponResponse> {
    const coupon = await this.repository.findByCode({
      code: command.code,
      environmentId: command.environment_id,
    });

    if (!coupon) {
      return {
        valid: false,
        reason: "Coupon not found",
      };
    }

    try {
      coupon.validateForCustomer(command.plan_id, command.is_first_time);
    } catch (error: any) {
      return {
        valid: false,
        reason: error.message || "Invalid coupon",
      };
    }

    const v = coupon.val;

    return {
      valid: true,
      coupon: {
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
      },
    };
  }
}
