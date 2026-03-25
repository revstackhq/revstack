import { DomainError } from "@/common/errors/DomainError";

export class CouponNotFoundError extends DomainError {
  constructor() {
    super("Coupon not found", 404, "COUPON_NOT_FOUND");
  }
}
