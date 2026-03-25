import type { CouponEntity } from "@/modules/coupons/domain/CouponEntity";

export interface CouponRepository {
  save(coupon: CouponEntity): Promise<void>;
  findById(id: string): Promise<CouponEntity | null>;
  findByCode(environmentId: string, code: string): Promise<CouponEntity | null>;
  find(filters: { environmentId?: string; isActive?: boolean; isArchived?: boolean }): Promise<CouponEntity[]>;
  delete(id: string): Promise<void>;
}
