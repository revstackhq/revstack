import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import { CouponNotFoundError } from "@revstackhq/core";

export const GetCouponQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetCouponQuery = z.infer<typeof GetCouponQuerySchema>;

export const GetCouponResponseSchema = z.object({
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

export type GetCouponResponse = z.infer<typeof GetCouponResponseSchema>;

export class GetCouponHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: GetCouponQuery): Promise<GetCouponResponse> {
    const coupon = await this.repository.findById(query.id);

    if (!coupon) {
      throw new CouponNotFoundError();
    }

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
