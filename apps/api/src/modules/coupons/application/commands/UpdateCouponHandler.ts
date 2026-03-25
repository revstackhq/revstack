import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateCouponCommand } from "@/modules/coupons/application/commands/UpdateCouponCommand";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class UpdateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: UpdateCouponCommand) {
    const coupon = await this.repository.findById(command.couponId);
    if (!coupon) {
      throw new CouponNotFoundError();
    }

    coupon.update(command);

    await this.repository.save(coupon);
    await this.eventBus.publish({ eventName: "coupon.updated", id: coupon.id, environmentId: coupon.environmentId });

    return coupon.toPrimitives();
  }
}
