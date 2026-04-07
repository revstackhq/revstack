import { z } from "zod";
import { CouponNotFoundError, type CouponRepository } from "@revstackhq/core";

export const GetCouponQuerySchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type GetCouponQuery = z.infer<typeof GetCouponQuerySchema>;

export const GetCouponResponseSchema = z
  .object({
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
  })
  .nullable();

export type GetCouponResponse = z.infer<typeof GetCouponResponseSchema>;

export class GetCouponHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: GetCouponQuery): Promise<GetCouponResponse> {
    const coupon = await this.repository.findById({
      id: query.id,
      environmentId: query.environment_id,
    });

    if (!coupon) {
      throw new CouponNotFoundError(query.id);
    }

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
