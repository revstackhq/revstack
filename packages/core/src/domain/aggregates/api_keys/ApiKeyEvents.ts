import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface ApiKeyCreatedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyCreatedEvent extends DomainEvent<ApiKeyCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_CREATED;

  constructor(payload: ApiKeyCreatedPayload) {
    super(payload);
  }
}

export interface ApiKeyUpdatedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyUpdatedEvent extends DomainEvent<ApiKeyUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_UPDATED;

  constructor(payload: ApiKeyUpdatedPayload) {
    super(payload);
  }
}

export interface ApiKeyDeletedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyDeletedEvent extends DomainEvent<ApiKeyDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_DELETED;

  constructor(payload: ApiKeyDeletedPayload) {
    super(payload);
  }
}

export interface ApiKeyRotatedPayload {
  key: string;
  environmentId: string;
  actorId: string;
}

export class ApiKeyRotatedEvent extends DomainEvent<ApiKeyRotatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_ROTATED;

  constructor(payload: ApiKeyRotatedPayload) {
    super(payload);
  }
}
