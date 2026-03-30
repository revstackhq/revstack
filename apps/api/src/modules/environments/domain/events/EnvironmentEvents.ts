import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface EnvironmentCreatedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentCreatedEvent extends DomainEvent {
  public readonly eventName = "environment.created";
  constructor(public readonly payload: EnvironmentCreatedPayload) {
    super(payload);
  }
}

export interface EnvironmentDeletedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentDeletedEvent extends DomainEvent {
  public readonly eventName = "environment.deleted";
  constructor(public readonly payload: EnvironmentDeletedPayload) {
    super(payload);
  }
}

export interface EnvironmentUpdatedPayload {
  id: string;
  projectId: string;
}

export class EnvironmentUpdatedEvent extends DomainEvent {
  public readonly eventName = "environment.updated";
  constructor(public readonly payload: EnvironmentUpdatedPayload) {
    super(payload);
  }
}
