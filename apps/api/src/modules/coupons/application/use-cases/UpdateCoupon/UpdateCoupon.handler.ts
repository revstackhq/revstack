import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateCouponCommand } from "./UpdateCoupon.schema";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class UpdateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: UpdateCouponCommand) {
    const coupon = await this.repository.findById(command.coupon_id);
    if (!coupon) {
      throw new CouponNotFoundError();
    }

    coupon.update({
      isActive: command.is_active,
      metadata: command.metadata,
    });

    await this.repository.save(coupon);

    const v = coupon.val;
    return {
      id: v.id!,
      environment_id: v.environmentId,
      code: v.code,
      type: v.type,
      amount: v.amount,
      is_active: v.isActive,
      is_archived: v.isArchived,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
