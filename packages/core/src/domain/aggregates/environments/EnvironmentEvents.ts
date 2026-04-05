import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface EnvironmentCreatedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentCreatedEvent extends DomainEvent {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_CREATED;
  constructor(public readonly payload: EnvironmentCreatedPayload) {
    super(payload);
  }
}

export interface EnvironmentDeletedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentDeletedEvent extends DomainEvent {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_DELETED;
  constructor(public readonly payload: EnvironmentDeletedPayload) {
    super(payload);
  }
}

export interface EnvironmentUpdatedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentUpdatedEvent extends DomainEvent {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_UPDATED;
  constructor(public readonly payload: EnvironmentUpdatedPayload) {
    super(payload);
  }
}
