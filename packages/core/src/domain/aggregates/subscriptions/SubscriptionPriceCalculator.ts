import { DiscountLimitExceededError } from "./SubscriptionErrors";
import type { SubscriptionCoupon } from "./SubscriptionEntity";

export class SubscriptionPriceCalculator {
  public static readonly MAX_PERCENTAGE_BPS = 10000;

  public clampToNonNegative(amount: number): number {
    return Math.max(0, amount);
  }

  public assertPercentageWithinLimit(amountBps: number): void {
    if (amountBps > SubscriptionPriceCalculator.MAX_PERCENTAGE_BPS) {
      throw new DiscountLimitExceededError();
    }
  }

  public sumPercentageDiscounts(coupons: SubscriptionCoupon[]): number {
    return coupons
      .filter((cp) => cp.type === "percentage")
      .reduce((acc, cp) => acc + cp.value, 0);
  }

  public calculatePercentageDiscount(
    amountCents: number,
    amountBps: number,
  ): number {
    return Math.round(
      (amountCents * amountBps) / SubscriptionPriceCalculator.MAX_PERCENTAGE_BPS,
    );
  }

  public applyFixedDiscount(
    amountCents: number,
    discountCents: number,
  ): number {
    return this.clampToNonNegative(amountCents - discountCents);
  }

  public assertTotalPercentageWithinLimit(
    currentBps: number,
    addedBps: number,
  ): void {
    if (
      currentBps + addedBps >
      SubscriptionPriceCalculator.MAX_PERCENTAGE_BPS
    ) {
      throw new DiscountLimitExceededError(
        "Total percentage discount exceeds 100%",
      );
    }
  }
}
