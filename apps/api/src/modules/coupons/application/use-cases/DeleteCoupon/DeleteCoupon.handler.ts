import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteCouponCommand } from "./DeleteCoupon.schema";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class DeleteCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: DeleteCouponCommand) {
    const coupon = await this.repository.findById(command.id);
    if (!coupon) {
      throw new CouponNotFoundError();
    }

    await this.repository.delete(command.id);
    await this.eventBus.publish({ eventName: "coupon.deleted", id: coupon.id, environmentId: coupon.environmentId });

    return { success: true };
  }
}
