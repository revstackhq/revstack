import { BadRequestError, NotFoundError } from "@/domain/base/DomainError";

export class SubscriptionDomainError extends BadRequestError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "SubscriptionDomainError";
  }
}

export class SubscriptionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(
      `Subscription with ID ${id} was not found.`,
      "SUBSCRIPTION_NOT_FOUND",
    );
  }
}

export class SubscriptionAlreadyCanceledError extends SubscriptionDomainError {
  constructor(id: string) {
    super(
      `Subscription ${id} is already canceled.`,
      "SUBSCRIPTION_ALREADY_CANCELED",
    );
  }
}

export class SubscriptionAlreadyRevokedError extends SubscriptionDomainError {
  constructor(id: string) {
    super(
      `Subscription ${id} has been revoked and cannot be modified.`,
      "SUBSCRIPTION_ALREADY_REVOKED",
    );
  }
}

export class InvalidSubscriptionStatusError extends SubscriptionDomainError {
  constructor(
    public readonly action: string,
    public readonly currentStatus: string,
    message?: string,
  ) {
    super(
      message ??
        `Cannot perform ${action} while subscription is ${currentStatus}.`,
      "INVALID_SUBSCRIPTION_STATUS",
    );
  }
}

export class AddonNotFoundError extends SubscriptionDomainError {
  constructor(addonId: string) {
    super(
      `Addon ${addonId} not found in this subscription.`,
      "ADDON_NOT_FOUND",
    );
  }
}

export class InvalidTrialDateError extends SubscriptionDomainError {
  constructor() {
    super("Trial end date must be in the future.", "INVALID_TRIAL_DATE");
  }
}

export class SubscriptionScheduleError extends SubscriptionDomainError {
  constructor(message: string) {
    super(message, "SUBSCRIPTION_SCHEDULE_INVALID");
  }
}

export class InvalidAddonQuantityError extends SubscriptionDomainError {
  constructor(public readonly quantity: number) {
    super(
      `Addon quantity must be greater than 0. Received: ${quantity}`,
      "INVALID_ADDON_QUANTITY",
    );
  }
}

export class SubscriptionCouponError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "SubscriptionCouponError";
  }
}

export class InactiveCouponError extends SubscriptionCouponError {
  constructor(couponId: string) {
    super(`Coupon ${couponId} is not active`, "COUPON_INACTIVE");
  }
}

export class CouponPlanRestrictionError extends SubscriptionCouponError {
  constructor(couponId: string, planId: string) {
    super(
      `Coupon ${couponId} is not valid for plan ${planId}`,
      "COUPON_PLAN_RESTRICTED",
    );
  }
}

export class CouponCurrencyMismatchError extends SubscriptionCouponError {
  constructor(couponCurrency: string, subCurrency: string) {
    super(
      `Currency mismatch: Coupon is ${couponCurrency} but subscription is ${subCurrency}`,
      "COUPON_CURRENCY_MISMATCH",
    );
  }
}

export class DiscountLimitExceededError extends SubscriptionCouponError {
  constructor(message: string = "Total discount cannot exceed 100%") {
    super(message, "DISCOUNT_LIMIT_EXCEEDED");
  }
}

export class CouponNotFoundError extends SubscriptionCouponError {
  constructor(couponId: string) {
    super(
      `Coupon ${couponId} not found in this subscription`,
      "COUPON_NOT_FOUND",
    );
  }
}
