import {
  SubscriptionAddonAddedEvent,
  SubscriptionAddonRemovedEvent,
  SubscriptionCanceledEvent,
  SubscriptionCouponAppliedEvent,
  SubscriptionCouponRemovedEvent,
  SubscriptionCreatedEvent,
  SubscriptionPausedEvent,
  SubscriptionResumedEvent,
  SubscriptionRevokedEvent,
  SubscriptionScheduleUpdatedEvent,
  SubscriptionTrialEndedEvent,
  SubscriptionUpdatedEvent,
} from "./SubscriptionEvents";

export class SubscriptionEventFactory {
  public created(payload: {
    id: string;
    environmentId: string;
    customerId: string;
    planId: string;
    status: string;
  }): SubscriptionCreatedEvent {
    return new SubscriptionCreatedEvent(payload);
  }

  public updated(payload: {
    id: string;
    environmentId: string;
    changes: string[];
  }): SubscriptionUpdatedEvent {
    return new SubscriptionUpdatedEvent(payload);
  }

  public canceled(payload: {
    id: string;
    environmentId: string;
    immediately: boolean;
  }): SubscriptionCanceledEvent {
    return new SubscriptionCanceledEvent(payload);
  }

  public addonAdded(payload: {
    subscriptionId: string;
    environmentId: string;
    addonId: string;
    quantity: number;
  }): SubscriptionAddonAddedEvent {
    return new SubscriptionAddonAddedEvent(payload);
  }

  public addonRemoved(payload: {
    subscriptionId: string;
    environmentId: string;
    addonId: string;
  }): SubscriptionAddonRemovedEvent {
    return new SubscriptionAddonRemovedEvent(payload);
  }

  public scheduleUpdated(payload: {
    id: string;
    environmentId: string;
    pendingPlanId: string;
    pendingPriceId: string;
    effectiveAt: Date;
  }): SubscriptionScheduleUpdatedEvent {
    return new SubscriptionScheduleUpdatedEvent(payload);
  }

  public trialEnded(payload: {
    id: string;
    environmentId: string;
  }): SubscriptionTrialEndedEvent {
    return new SubscriptionTrialEndedEvent(payload);
  }

  public revoked(payload: {
    id: string;
    environmentId: string;
    revokedAt: Date;
  }): SubscriptionRevokedEvent {
    return new SubscriptionRevokedEvent(payload);
  }

  public resumed(payload: {
    id: string;
    environmentId: string;
    requiresImmediateBilling: boolean;
  }): SubscriptionResumedEvent {
    return new SubscriptionResumedEvent(payload);
  }

  public paused(payload: {
    id: string;
    environmentId: string;
  }): SubscriptionPausedEvent {
    return new SubscriptionPausedEvent(payload);
  }

  public couponApplied(payload: {
    subscriptionId: string;
    environmentId: string;
    couponId: string;
  }): SubscriptionCouponAppliedEvent {
    return new SubscriptionCouponAppliedEvent(payload);
  }

  public couponRemoved(payload: {
    subscriptionId: string;
    environmentId: string;
    couponId: string;
    reason: string;
  }): SubscriptionCouponRemovedEvent {
    return new SubscriptionCouponRemovedEvent(payload);
  }
}
