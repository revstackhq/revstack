import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants";

export interface UserCreatedPayload {
  userId: string;
  email: string;
  environmentId: string;
  role: string;
}

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.USER_CREATED;
  constructor(payload: UserCreatedPayload) {
    super(payload);
  }
}

export interface UserUpdatedPayload {
  userId: string;
  environmentId: string;
  changes: string[];
}

export class UserUpdatedEvent extends DomainEvent<UserUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.USER_UPDATED;
  constructor(payload: UserUpdatedPayload) {
    super(payload);
  }
}

export interface UserDeactivatedPayload {
  userId: string;
  environmentId: string;
  email: string;
  reason?: string;
}

export class UserDeactivatedEvent extends DomainEvent<UserDeactivatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.USER_DEACTIVATED;
  constructor(payload: UserDeactivatedPayload) {
    super(payload);
  }
}
