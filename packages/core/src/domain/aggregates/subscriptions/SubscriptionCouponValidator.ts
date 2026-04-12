import {
  CouponCurrencyMismatchError,
  CouponPlanRestrictionError,
  InactiveCouponError,
} from "./SubscriptionErrors";
import type {
  ApplyCouponInput,
  SubscriptionCoupon,
} from "./SubscriptionEntity";
import { SubscriptionPriceCalculator } from "./SubscriptionPriceCalculator";
import { CouponExpiredError } from "../coupons/CouponErrors";

export interface SubscriptionCouponValidationContext {
  planId: string;
  currency: string;
  existingCoupons: SubscriptionCoupon[];
}

export class SubscriptionCouponValidator {
  public validate(
    input: ApplyCouponInput,
    context: SubscriptionCouponValidationContext,
  ): void {
    const priceCalculator = new SubscriptionPriceCalculator();

    if (input.status !== "active") {
      throw new InactiveCouponError(input.id);
    }

    if (input.expiresAt && input.expiresAt < new Date()) {
      throw new CouponExpiredError(input.id);
    }

    if (
      input.restrictedPlanIds.length > 0 &&
      !input.restrictedPlanIds.includes(context.planId)
    ) {
      throw new CouponPlanRestrictionError(input.id, context.planId);
    }

    if (input.type === "fixed_amount" && input.currency !== context.currency) {
      throw new CouponCurrencyMismatchError(
        input.currency ?? "N/A",
        context.currency,
      );
    }

    if (input.type === "percentage") {
      priceCalculator.assertPercentageWithinLimit(input.amount);

      const currentPercent = priceCalculator.sumPercentageDiscounts(
        context.existingCoupons,
      );

      priceCalculator.assertTotalPercentageWithinLimit(
        currentPercent,
        input.amount,
      );
    }
  }
}
