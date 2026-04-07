import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface EntitlementCreatedPayload {
  id: string;
  environmentId: string;
  slug: string;
}

export class EntitlementCreatedEvent extends DomainEvent<EntitlementCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENTITLEMENT_CREATED;
  constructor(payload: EntitlementCreatedPayload) {
    super(payload);
  }
}

export interface EntitlementUpdatedPayload {
  id: string;
  environmentId: string;
}

export class EntitlementUpdatedEvent extends DomainEvent<EntitlementUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENTITLEMENT_UPDATED;
  constructor(payload: EntitlementUpdatedPayload) {
    super(payload);
  }
}

export interface EntitlementArchivedPayload {
  id: string;
  environmentId: string;
}

export class EntitlementArchivedEvent extends DomainEvent<EntitlementArchivedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENTITLEMENT_ARCHIVED;
  constructor(payload: EntitlementArchivedPayload) {
    super(payload);
  }
}

export interface EntitlementDeletedPayload {
  id: string;
  environmentId: string;
}

export class EntitlementDeletedEvent extends DomainEvent<EntitlementDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENTITLEMENT_DELETED;
  constructor(payload: EntitlementDeletedPayload) {
    super(payload);
  }
}
