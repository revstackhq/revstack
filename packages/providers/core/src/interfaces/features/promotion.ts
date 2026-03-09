import { ProviderContext } from "@/context";
import {
  ApplyDiscountInput,
  Coupon,
  CreateCouponInput,
  GetCouponInput,
} from "@/types/promotions";
import { AsyncActionResult } from "@/types/shared";

export interface IPromotionFeature {
  /**
   * Creates a native discount coupon within the provider's ecosystem.
   * Required when `promotions.coupons` is set to "native".
   * * @param ctx - The provider execution context.
   * @param input - Coupon parameters including percentage/amount off and duration.
   * @returns An AsyncActionResult containing the provider's native coupon ID.
   */
  createCoupon?(
    ctx: ProviderContext,
    input: CreateCouponInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Applies an existing discount coupon to a specific customer or active subscription.
   * * @param ctx - The provider execution context.
   * @param input - The target customer/subscription and the coupon ID to apply.
   * @returns An AsyncActionResult indicating the success of the application.
   */
  applyDiscount?(
    ctx: ProviderContext,
    input: ApplyDiscountInput,
  ): Promise<AsyncActionResult<boolean>>;

  /**
   * Retrieves an existing discount coupon by its ID.
   * * @param ctx - The provider execution context.
   * @param input - The coupon ID to retrieve.
   * @returns An AsyncActionResult containing the coupon details.
   */
  getCoupon?(
    ctx: ProviderContext,
    input: GetCouponInput,
  ): Promise<AsyncActionResult<Coupon>>;
}
