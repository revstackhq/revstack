import { CouponDuration } from "@/types/promotions/model";

/**
 * Input parameters for creating a native discount coupon.
 * Used when `promotions.coupons` is "native".
 */
export interface CreateCouponInput {
  /** The visible code the user will type at checkout (e.g., "BLACKFRIDAY"). */
  code: string;
  /** The percentage to discount (e.g., 20.5 for 20.5% off). Mutually exclusive with `amountOff`. */
  percentOff?: number;
  /** The fixed amount to discount in the smallest currency unit. Mutually exclusive with `percentOff`. */
  amountOff?: number;
  /** Required if `amountOff` is provided. The ISO currency code of the discount. */
  currency?: string;
  /** * How long the discount applies to a recurring subscription.
   * - `once`: Applies only to the first invoice.
   * - `repeating`: Applies for a specific number of months.
   * - `forever`: Applies as long as the subscription is active.
   */
  duration: CouponDuration;
  /** Required if `duration` is "repeating". The number of months the discount lasts. */
  durationInMonths?: number;
  /** Optional: Maximum number of times this coupon can be redeemed globally. */
  maxRedemptions?: number;
}

/**
 * Input parameters for applying a coupon to an existing customer or subscription.
 */
export interface ApplyDiscountInput {
  /** The target customer ID. */
  customerId: string;
  /** Optional: If provided, the discount only applies to this specific subscription. */
  subscriptionId?: string;
  /** The provider's internal coupon ID to apply. */
  couponId: string;
}

export interface GetCouponInput {
  /** The provider's internal coupon ID to retrieve. */
  id: string;
}
