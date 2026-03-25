import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { GetCouponQuery } from "@/modules/coupons/application/queries/GetCouponQuery";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class GetCouponHandler {
  constructor(private readonly repository: CouponRepository) {}

  public async handle(query: GetCouponQuery) {
    const coupon = await this.repository.findById(query.id);
    if (!coupon) {
      throw new CouponNotFoundError();
    }
    return coupon.toPrimitives();
  }
}
