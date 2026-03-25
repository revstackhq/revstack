import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { ListCouponsQuery } from "@/modules/coupons/application/queries/ListCouponsQuery";

export class ListCouponsHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async handle(query: ListCouponsQuery) {
    const coupons = await this.repository.find({
      environmentId: query.environmentId,
      isActive: query.isActive,
      isArchived: query.isArchived,
    });
    return coupons.map(c => c.toPrimitives());
  }
}
