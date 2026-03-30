import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { ArchiveCouponCommand } from "./ArchiveCoupon.schema";
import { CouponNotFoundError } from "@/modules/coupons/domain/CouponErrors";

export class ArchiveCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: ArchiveCouponCommand) {
    const coupon = await this.repository.findById(command.id);
    if (!coupon) {
      throw new CouponNotFoundError();
    }

    coupon.archive();

    await this.repository.save(coupon);
    await this.eventBus.publish({ eventName: "coupon.archived", id: coupon.id, environmentId: coupon.environmentId });

    return { success: true };
  }
}
