import type { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PostgresCouponRepository } from "@/modules/coupons/infrastructure/adapters/PostgresCouponRepository";
import { CreateCouponHandler } from "@/modules/coupons/application/use-cases/CreateCoupon";
import { UpdateCouponHandler } from "@/modules/coupons/application/use-cases/UpdateCoupon";
import { ArchiveCouponHandler } from "@/modules/coupons/application/use-cases/ArchiveCoupon";
import { GetCouponHandler } from "@/modules/coupons/application/use-cases/GetCoupon";
import { ListCouponsHandler } from "@/modules/coupons/application/use-cases/ListCoupons";
import { ValidateCouponHandler } from "@/modules/coupons/application/use-cases/ValidateCoupon";

export function buildCouponsModule(db: DrizzleDB, eventBus: EventBus) {
  const repository = new PostgresCouponRepository(db);

  return {
    get create() {
      return new CreateCouponHandler(repository, eventBus);
    },
    get update() {
      return new UpdateCouponHandler(repository, eventBus);
    },
    get archive() {
      return new ArchiveCouponHandler(repository, eventBus);
    },
    get get() {
      return new GetCouponHandler(repository);
    },
    get list() {
      return new ListCouponsHandler(repository);
    },
    get validate() {
      return new ValidateCouponHandler(repository);
    },
  };
}
