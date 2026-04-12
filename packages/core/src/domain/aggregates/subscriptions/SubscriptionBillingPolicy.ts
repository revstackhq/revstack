import type {
  SubscriptionAddon,
  SubscriptionCoupon,
} from "./SubscriptionEntity";
import { SubscriptionPriceCalculator } from "./SubscriptionPriceCalculator";

export interface CalculateNextInvoiceInput {
  baseAmount: number;
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  addons: SubscriptionAddon[];
  coupons: SubscriptionCoupon[];
  asOf?: Date;
}

export interface CalculateNextInvoiceResult {
  currency: string;
  periodStart: Date;
  periodEnd: Date;
  baseAmount: number;
  addonsTotal: number;
  subtotal: number;
  fixedDiscount: number;
  percentageDiscount: number;
  totalDiscount: number;
  total: number;
  appliedCouponIds: string[];
}

export class SubscriptionBillingPolicy {
  private readonly priceCalculator = new SubscriptionPriceCalculator();

  public calculateNextInvoice(
    input: CalculateNextInvoiceInput,
  ): CalculateNextInvoiceResult {
    const addonsTotal = this.calculateAddonsTotal(input.addons);
    const subtotal = input.baseAmount + addonsTotal;

    const activeCoupons = this.filterActiveCoupons(
      input.coupons,
      input.asOf ?? new Date(),
      input.periodStart,
    );

    const fixedDiscount = this.sumFixedDiscounts(activeCoupons);
    const subtotalAfterFixed = this.priceCalculator.applyFixedDiscount(
      subtotal,
      fixedDiscount,
    );

    const percentageBps =
      this.priceCalculator.sumPercentageDiscounts(activeCoupons);
    this.priceCalculator.assertTotalPercentageWithinLimit(0, percentageBps);

    const percentageDiscount = this.priceCalculator.calculatePercentageDiscount(
      subtotalAfterFixed,
      percentageBps,
    );

    const totalDiscount = fixedDiscount + percentageDiscount;
    const total = this.priceCalculator.clampToNonNegative(
      subtotal - totalDiscount,
    );

    return {
      currency: input.currency,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      baseAmount: input.baseAmount,
      addonsTotal,
      subtotal,
      fixedDiscount,
      percentageDiscount,
      totalDiscount,
      total,
      appliedCouponIds: activeCoupons.map((coupon) => coupon.couponId),
    };
  }

  public calculateAddonsTotal(addons: SubscriptionAddon[]): number {
    return addons.reduce(
      (acc, addon) => acc + addon.unitAmount * addon.quantity,
      0,
    );
  }

  public filterActiveCoupons(
    coupons: SubscriptionCoupon[],
    asOf: Date,
    periodStart: Date,
  ): SubscriptionCoupon[] {
    return coupons.filter((coupon) => {
      if (!coupon.benefitEndsAt) return true;
      if (coupon.benefitEndsAt < periodStart) return false;
      return coupon.benefitEndsAt >= asOf;
    });
  }

  public sumFixedDiscounts(coupons: SubscriptionCoupon[]): number {
    return coupons
      .filter((coupon) => coupon.type === "fixed_amount")
      .reduce((acc, coupon) => acc + coupon.value, 0);
  }
}
