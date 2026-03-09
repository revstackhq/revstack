export type CouponDuration = "once" | "repeating" | "forever";

export interface Coupon {
  id: string;
  name?: string;
  description?: string;
  amountOff?: number;
  percentOff?: number;
  currency?: string;
  duration: CouponDuration;
  durationInMonths?: number;
  maxRedemptions?: number;
  redeemBy?: Date;
  createdAt: Date;
  updatedAt: Date;
}
