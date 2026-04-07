import { BadRequestError, NotFoundError } from "@/domain/base/DomainError";

export class CouponNotFoundError extends NotFoundError {
  constructor(idOrCode: string) {
    super(`Coupon '${idOrCode}' was not found.`, "COUPON_NOT_FOUND");
  }
}

export class CouponExpiredError extends BadRequestError {
  constructor(code: string) {
    super(`Coupon '${code}' has expired.`, "COUPON_EXPIRED");
  }
}

export class CouponLimitReachedError extends BadRequestError {
  constructor(code: string) {
    super(`Coupon '${code}' has reached its redemption limit.`, "COUPON_LIMIT_REACHED");
  }
}

export class IneligibleCouponError extends BadRequestError {
  constructor(code: string) {
    super(
      `Coupon '${code}' is not valid for this customer or plan.`,
      "INELIGIBLE_COUPON",
    );
  }
}
