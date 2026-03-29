import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface ApiKeyCreatedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyCreatedEvent extends DomainEvent<ApiKeyCreatedPayload> {
  public readonly eventName = "api_key.created";

  constructor(payload: ApiKeyCreatedPayload) {
    super(payload);
  }
}

export interface ApiKeyUpdatedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyUpdatedEvent extends DomainEvent<ApiKeyUpdatedPayload> {
  public readonly eventName = "api_key.updated";

  constructor(payload: ApiKeyUpdatedPayload) {
    super(payload);
  }
}

export interface ApiKeyDeletedPayload {
  key: string;
  environmentId: string;
}

export class ApiKeyDeletedEvent extends DomainEvent<ApiKeyDeletedPayload> {
  public readonly eventName = "api_key.deleted";

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
  public readonly eventName = "api_key.rotated";

  constructor(payload: ApiKeyRotatedPayload) {
    super(payload);
  }
}
