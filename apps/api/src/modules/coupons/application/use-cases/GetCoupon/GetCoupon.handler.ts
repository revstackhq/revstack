import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { GetCouponQuery } from "./GetCoupon.schema";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class GetCouponHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: GetCouponQuery) {
    const coupon = await this.repository.findById(query.id);
    if (!coupon) {
      throw new CouponNotFoundError();
    }

    const v = coupon.val;
    return {
      id: v.id!,
      environment_id: v.environmentId,
      code: v.code,
      type: v.type,
      amount: v.amount,
      is_active: v.isActive,
      is_archived: v.isArchived,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
