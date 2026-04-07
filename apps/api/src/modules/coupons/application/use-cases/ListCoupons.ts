import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";

export const ListCouponsQuerySchema = z.object({
  environment_id: z.string().min(1),
  status: z.enum(["active", "inactive", "archived"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type ListCouponsQuery = z.infer<typeof ListCouponsQuerySchema>;

export const CouponItemSchema = z.object({
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

export const ListCouponsResponseSchema = z.object({
  data: z.array(CouponItemSchema),
  pagination: z.object({
    next_cursor: z.string().nullable(),
    has_more: z.boolean(),
  }),
});

export type ListCouponsResponse = z.infer<typeof ListCouponsResponseSchema>;

export class ListCouponsHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: ListCouponsQuery): Promise<ListCouponsResponse> {
    const result = await this.repository.list({
      environmentId: query.environment_id,
      status: query.status,
      limit: query.limit,
      cursor: query.cursor,
    });

    return {
      data: result.data.map((coupon) => {
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
      }),
      pagination: {
        next_cursor: result.pagination?.nextCursor ?? null,
        has_more: result.pagination?.hasMore ?? false,
      },
    };
  }
}
