import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface CouponCreatedPayload {
  id: string;
  code: string;
  environmentId: string;
}

export class CouponCreatedEvent extends DomainEvent<CouponCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.COUPON_CREATED;

  constructor(payload: CouponCreatedPayload) {
    super(payload);
  }
}

export interface CouponArchivedPayload {
  id: string;
  environmentId: string;
}

export class CouponArchivedEvent extends DomainEvent<CouponArchivedPayload> {
  public readonly eventName = DOMAIN_EVENTS.COUPON_ARCHIVED;

  constructor(payload: CouponArchivedPayload) {
    super(payload);
  }
}

export interface CouponDeletedPayload {
  id: string;
  environmentId: string;
}

export class CouponDeletedEvent extends DomainEvent<CouponDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.COUPON_DELETED;

  constructor(payload: CouponDeletedPayload) {
    super(payload);
  }
}

export interface CouponUpdatedPayload {
  id: string;
  environmentId: string;
}

export class CouponUpdatedEvent extends DomainEvent<CouponUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.COUPON_UPDATED;

  constructor(payload: CouponUpdatedPayload) {
    super(payload);
  }
}
