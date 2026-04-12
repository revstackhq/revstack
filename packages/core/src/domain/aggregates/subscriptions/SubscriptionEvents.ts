import { DOMAIN_EVENTS } from "@/constants";
import { DomainEvent } from "@/domain/base/DomainEvent";

export interface BaseSubscriptionPayload {
  id: string;
  environmentId: string;
}

export interface SubscriptionCreatedPayload {
  id: string;
  environmentId: string;
  customerId: string;
  planId: string;
  status: string;
}

export interface SubscriptionUpdatedPayload {
  id: string;
  environmentId: string;
  changes: string[];
}

export interface SubscriptionCanceledPayload extends BaseSubscriptionPayload {
  immediately: boolean;
}

export interface SubscriptionAddonAddedPayload {
  subscriptionId: string;
  environmentId: string;
  addonId: string;
  quantity: number;
}

export interface SubscriptionAddonRemovedPayload {
  subscriptionId: string;
  environmentId: string;
  addonId: string;
}

export interface SubscriptionRevokedPayload {
  id: string;
  environmentId: string;
  revokedAt: Date;
}

export interface SubscriptionSchedulePayload {
  id: string;
  environmentId: string;
  pendingPlanId: string;
  pendingPriceId: string;
  effectiveAt: Date;
}

export interface SubscriptionPausedPayload {
  id: string;
  environmentId: string;
}

export interface SubscriptionResumedPayload {
  id: string;
  environmentId: string;
  requiresImmediateBilling: boolean;
}

export interface SubscriptionCouponAppliedPayload {
  subscriptionId: string;
  environmentId: string;
  couponId: string;
}

export interface SubscriptionCouponRemovedPayload {
  subscriptionId: string;
  environmentId: string;
  couponId: string;
  reason: string;
}

export class SubscriptionResumedEvent extends DomainEvent<SubscriptionResumedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_RESUMED;

  constructor(payload: SubscriptionResumedPayload) {
    super(payload);
  }
}

export class SubscriptionPausedEvent extends DomainEvent<SubscriptionPausedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_PAUSED;

  constructor(payload: SubscriptionPausedPayload) {
    super(payload);
  }
}

export class SubscriptionCreatedEvent extends DomainEvent<SubscriptionCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_CREATED;

  constructor(payload: SubscriptionCreatedPayload) {
    super(payload);
  }
}

export class SubscriptionUpdatedEvent extends DomainEvent<SubscriptionUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_UPDATED;

  constructor(payload: SubscriptionUpdatedPayload) {
    super(payload);
  }
}

export class SubscriptionCanceledEvent extends DomainEvent<SubscriptionCanceledPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_CANCELED;

  constructor(payload: SubscriptionCanceledPayload) {
    super(payload);
  }
}

export class SubscriptionRevokedEvent extends DomainEvent<SubscriptionRevokedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_REVOKED;

  constructor(payload: SubscriptionRevokedPayload) {
    super(payload);
  }
}

export class SubscriptionAddonAddedEvent extends DomainEvent<SubscriptionAddonAddedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_ADDON_ADDED;

  constructor(payload: SubscriptionAddonAddedPayload) {
    super(payload);
  }
}

export class SubscriptionAddonRemovedEvent extends DomainEvent<SubscriptionAddonRemovedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_ADDON_REMOVED;

  constructor(payload: SubscriptionAddonRemovedPayload) {
    super(payload);
  }
}

export class SubscriptionScheduleUpdatedEvent extends DomainEvent<SubscriptionSchedulePayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_SCHEDULE_UPDATED;

  constructor(payload: SubscriptionSchedulePayload) {
    super(payload);
  }
}

export class SubscriptionTrialEndedEvent extends DomainEvent<{
  id: string;
  environmentId: string;
}> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_TRIAL_ENDED;

  constructor(payload: { id: string; environmentId: string }) {
    super(payload);
  }
}

export class SubscriptionCouponAppliedEvent extends DomainEvent<SubscriptionCouponAppliedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_COUPON_APPLIED;

  constructor(payload: SubscriptionCouponAppliedPayload) {
    super(payload);
  }
}

export class SubscriptionCouponRemovedEvent extends DomainEvent<SubscriptionCouponRemovedPayload> {
  public readonly eventName = DOMAIN_EVENTS.SUBSCRIPTION_COUPON_REMOVED;

  constructor(payload: SubscriptionCouponRemovedPayload) {
    super(payload);
  }
}
