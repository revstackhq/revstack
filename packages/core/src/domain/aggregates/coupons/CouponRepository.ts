import type { CouponEntity } from "@/domain/aggregates/coupons/CouponEntity";

export interface CouponRepository {
  save(coupon: CouponEntity): Promise<string>;
  findById(id: string): Promise<CouponEntity | null>;
  findByCode(environmentId: string, code: string): Promise<CouponEntity | null>;
  find(filters: {
    environmentId?: string;
    status?: "active" | "inactive" | "archived";
  }): Promise<CouponEntity[]>;
  delete(id: string): Promise<boolean>;
}
