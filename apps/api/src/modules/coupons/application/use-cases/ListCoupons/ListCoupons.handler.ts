import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { ListCouponsQuery } from "./ListCoupons.schema";

export class ListCouponsHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async execute(query: ListCouponsQuery) {
    const coupons = await this.repository.find({
      environmentId: query.environment_id,
      isActive: query.is_active,
      isArchived: query.is_archived,
    });
    return coupons.map((c) => {
      const v = c.val;
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
    });
  }
}
