import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateCouponCommand, CreateCouponResponse } from "./CreateCoupon.schema";
import { CouponEntity } from "@/modules/coupons/domain/CouponEntity";
import { DomainError } from "@/common/errors/DomainError";

export class CreateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateCouponCommand): Promise<CreateCouponResponse> {
    const existing = await this.repository.findByCode(command.environment_id, command.code);
    if (existing) {
      throw new DomainError("Coupon with this code already exists", 409, "COUPON_ALREADY_EXISTS");
    }

    const coupon = CouponEntity.create({
      environmentId: command.environment_id,
      code: command.code,
      type: command.type,
      amount: command.amount,
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
