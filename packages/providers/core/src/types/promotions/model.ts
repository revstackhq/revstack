export type CouponDuration = "once" | "repeating" | "forever";

export interface Coupon {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  amountOff?: number;
  percentOff?: number;
  currency?: string;
  duration: CouponDuration;
  timesRedeemed?: number;
  metadata?: Record<string, any>;
  durationInMonths?: number;
  maxRedemptions?: number;
  redeemBy?: Date;
  createdAt: Date;
  updatedAt: Date;
}
