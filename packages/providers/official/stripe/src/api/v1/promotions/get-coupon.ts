import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  GetCouponInput,
  Coupon,
  AsyncActionResult,
  fromUnixSeconds,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Retrieves an existing discount coupon by its ID.
 *
 * @param ctx - The provider execution context.
 * @param input - Contains the coupon ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Coupon entity.
 */
export async function getCoupon(
  ctx: ProviderContext,
  input: GetCouponInput,
): Promise<AsyncActionResult<Coupon>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const coupon = await stripe.coupons.retrieve(input.id);

    return {
      data: {
        id: coupon.id,
        name: coupon.name ?? undefined,
        percentOff: coupon.percent_off ?? undefined,
        amountOff: coupon.amount_off ?? undefined,
        currency: coupon.currency ?? undefined,
        duration: coupon.duration,
        durationInMonths: coupon.duration_in_months ?? undefined,
        maxRedemptions: coupon.max_redemptions ?? undefined,
        redeemBy: coupon.redeem_by
          ? fromUnixSeconds(coupon.redeem_by)
          : undefined,
        createdAt: fromUnixSeconds(coupon.created),
        updatedAt: fromUnixSeconds(coupon.created),
      },
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
