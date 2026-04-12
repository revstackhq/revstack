import { BadRequestError } from "@/domain/base/DomainError";

export class CouponDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "CouponDomainError";
  }
}

export class CouponCodeRequiredError extends CouponDomainError {
  constructor() {
    super("Coupon code is required", "COUPON_CODE_REQUIRED");
  }
}

export class InvalidCouponAmountError extends CouponDomainError {
  constructor(message: string = "Coupon amount cannot be negative") {
    super(message, "INVALID_COUPON_AMOUNT");
  }
}

export class CouponCurrencyRequiredError extends CouponDomainError {
  constructor() {
    super(
      "Currency is required for fixed amount coupons",
      "COUPON_CURRENCY_REQUIRED",
    );
  }
}

export class CouponAlreadyArchivedError extends CouponDomainError {
  constructor(id: string) {
    super(`Coupon ${id} is already archived`, "COUPON_ALREADY_ARCHIVED");
  }
}

export class CouponExpiredError extends CouponDomainError {
  constructor(code: string) {
    super(`Coupon '${code}' has expired`, "COUPON_EXPIRED");
  }
}

export class CouponLimitReachedError extends CouponDomainError {
  constructor(code: string) {
    super(
      `Coupon '${code}' has reached its redemption limit`,
      "COUPON_LIMIT_REACHED",
    );
  }
}

export class IneligibleCouponError extends CouponDomainError {
  constructor(
    code: string,
    reason: string = "Coupon is not eligible for this purchase",
  ) {
    super(reason, "INELIGIBLE_COUPON");
  }
}
