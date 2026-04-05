import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import { GetCouponResponseSchema } from "@/modules/coupons/application/use-cases/GetCoupon";

export const ListCouponsQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  status: z.enum(["active", "inactive", "archived"]).optional(),
});

export type ListCouponsQuery = z.infer<typeof ListCouponsQuerySchema>;

export const ListCouponsResponse = z.array(GetCouponResponseSchema);

export type ListCouponsResponse = z.infer<typeof ListCouponsResponse>;

export class ListCouponsHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: ListCouponsQuery): Promise<ListCouponsResponse> {
    const coupons = await this.repository.find({
      environmentId: query.environment_id,
      status: query.status,
    });

    return coupons.map((c) => {
      const v = c.val;

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
    });
  }
}
