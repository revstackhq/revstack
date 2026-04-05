import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

// --- Addon Events ---

export interface AddonCreatedPayload {
  id: string;
  slug: string;
  environment_id: string;
}

export class AddonCreatedEvent extends DomainEvent<AddonCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ADDON_CREATED;
  constructor(payload: AddonCreatedPayload) {
    super(payload);
  }
}

export interface AddonArchivedPayload {
  id: string;
  environment_id: string;
}

export class AddonArchivedEvent extends DomainEvent<AddonArchivedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ADDON_ARCHIVED;
  constructor(payload: AddonArchivedPayload) {
    super(payload);
  }
}

// --- Addon Entitlement Events ---

export interface AddonEntitlementCreatedPayload {
  addon_id: string;
  entitlement_id: string;
}

export class AddonEntitlementCreatedEvent extends DomainEvent<AddonEntitlementCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ADDON_ENTITLEMENT_CREATED;
  constructor(payload: AddonEntitlementCreatedPayload) {
    super(payload);
  }
}

export interface AddonEntitlementDeletedPayload {
  id: string;
  addon_id: string;
}

export class AddonEntitlementDeletedEvent extends DomainEvent<AddonEntitlementDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ADDON_ENTITLEMENT_DELETED;
  constructor(payload: AddonEntitlementDeletedPayload) {
    super(payload);
  }
}
