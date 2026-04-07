import type {
  CouponEntity,
  CouponStatus,
} from "@/domain/aggregates/coupons/CouponEntity";
import type { PaginatedCursorResult } from "@/types/pagination";

export interface CouponRepository {
  save(coupon: CouponEntity): Promise<string>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<CouponEntity | null>;

  findByCode(params: {
    environmentId: string;
    code: string;
  }): Promise<CouponEntity | null>;

  list(params: {
    environmentId: string;
    status?: CouponStatus;
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<CouponEntity>>;
}
