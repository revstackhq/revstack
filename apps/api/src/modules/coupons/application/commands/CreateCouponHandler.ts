import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateCouponCommand } from "@/modules/coupons/application/commands/CreateCouponCommand";
import { CouponEntity } from "@/modules/coupons/domain/CouponEntity";
import { DomainError } from "@/common/errors/DomainError";

export class CreateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateCouponCommand) {
    const existing = await this.repository.findByCode(command.environmentId, command.code);
    if (existing) {
      throw new DomainError("Coupon with this code already exists", 409, "COUPON_ALREADY_EXISTS");
    }

    const coupon = CouponEntity.create(command);

    await this.repository.save(coupon);
    await this.eventBus.publish({ eventName: "coupon.created", id: coupon.id, environmentId: coupon.environmentId });

    return coupon.toPrimitives();
  }
}
