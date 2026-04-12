import type { ApplyCouponInput } from "./SubscriptionEntity";
import { SubscriptionPeriod } from "./SubscriptionPeriod";

export class SubscriptionCouponBenefitPolicy {
  public calculateBenefitEndsAt(
    input: ApplyCouponInput,
    period: SubscriptionPeriod,
    createdAt: Date,
  ): Date | undefined {
    if (input.duration === "once") {
      return period.currentPeriodEnd;
    }

    if (input.duration === "repeating" && input.durationInMonths) {
      const ends = new Date(createdAt);
      ends.setMonth(ends.getMonth() + input.durationInMonths);
      return ends;
    }

    return undefined;
  }
}
