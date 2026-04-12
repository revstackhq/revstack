import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants";

export interface EnvironmentCreatedPayload {
  id: string;
  projectId: string;
  slug: string;
}

export class EnvironmentCreatedEvent extends DomainEvent<EnvironmentCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_CREATED;
  constructor(payload: EnvironmentCreatedPayload) {
    super(payload);
  }
}

export interface EnvironmentUpdatedPayload {
  id: string;
  projectId: string;
  changes: string[];
}

export class EnvironmentUpdatedEvent extends DomainEvent<EnvironmentUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_UPDATED;
  constructor(payload: EnvironmentUpdatedPayload) {
    super(payload);
  }
}

export interface EnvironmentDeletedPayload {
  id: string;
  projectId: string;
  slug: string;
}

export class EnvironmentDeletedEvent extends DomainEvent<EnvironmentDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.ENVIRONMENT_DELETED;
  constructor(payload: EnvironmentDeletedPayload) {
    super(payload);
  }
}
