import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  GetCouponInput,
  Coupon,
  AsyncActionResult,
  normalizeCurrency,
  CouponDuration,
  RevstackErrorCode,
  RevstackError,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { Discount } from "@polar-sh/sdk/models/components/discount.js";
import { DiscountPercentageRepeatDuration } from "@polar-sh/sdk/models/components/discountpercentagerepeatduration.js";
import { DiscountPercentageOnceForeverDuration } from "@polar-sh/sdk/models/components/discountpercentageonceforeverduration.js";
import { DiscountFixedRepeatDuration } from "@polar-sh/sdk/models/components/discountfixedrepeatduration.js";
import { DiscountFixedOnceForeverDuration } from "@polar-sh/sdk/models/components/discountfixedonceforeverduration.js";

export async function getCoupon(
  ctx: ProviderContext,
  input: GetCouponInput,
): Promise<AsyncActionResult<Coupon>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);
    const discount = (await polar.discounts.get({ id: input.id })) as Discount;

    return {
      data: mapPolarDiscountToCoupon(discount),
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null as any,
      status: "failed",
      error: error.isRevstackError ? error.errorPayload : mapError(error),
    };
  }
}

export function mapPolarDiscountToCoupon(discount: Discount): Coupon {
  const mapDuration = (duration: string): CouponDuration => {
    switch (duration) {
      case "once":
      case "repeating":
      case "forever":
        return duration;
      default:
        throw new RevstackError({
          code: RevstackErrorCode.InternalError,
          message: `Unsupported coupon duration received from Polar: ${duration}`,
          cause: "PROVIDER_MAPPING_ERROR",
        });
    }
  };

  const base = {
    id: discount.id,
    name: discount.name,
    code: discount.code ?? undefined,
    duration: mapDuration(discount.duration),
    timesRedeemed: discount.redemptionsCount,
    maxRedemptions: discount.maxRedemptions ?? undefined,
    redeemBy: discount.endsAt ?? undefined,
    createdAt: discount.createdAt,
    updatedAt: discount.modifiedAt ?? discount.createdAt,
    metadata: discount.metadata as Record<string, any>,
  };

  if (discount.type === "percentage") {
    const d = discount as
      | DiscountPercentageRepeatDuration
      | DiscountPercentageOnceForeverDuration;

    return {
      ...base,
      percentOff: d.basisPoints / 100,
      durationInMonths:
        "durationInMonths" in d ? d.durationInMonths : undefined,
    };
  }

  const d = discount as
    | DiscountFixedRepeatDuration
    | DiscountFixedOnceForeverDuration;

  return {
    ...base,
    amountOff: d.amount,
    currency: normalizeCurrency(d.currency, "uppercase"),
    durationInMonths: "durationInMonths" in d ? d.durationInMonths : undefined,
  };
}
