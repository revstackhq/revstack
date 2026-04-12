import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

// --- Created ---
export interface ApiKeyCreatedPayload {
  id: string;
  environmentId: string;
  type: string;
  name: string;
}

export class ApiKeyCreatedEvent extends DomainEvent<ApiKeyCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_CREATED;
  constructor(payload: ApiKeyCreatedPayload) {
    super(payload);
  }
}

// --- Updated ---
export interface ApiKeyUpdatedPayload {
  id: string;
  environmentId: string;
  changes: string[];
}

export class ApiKeyUpdatedEvent extends DomainEvent<ApiKeyUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_UPDATED;
  constructor(payload: ApiKeyUpdatedPayload) {
    super(payload);
  }
}

// --- Revoked ---
export interface ApiKeyRevokedPayload {
  id: string;
  environmentId: string;
}

export class ApiKeyRevokedEvent extends DomainEvent<ApiKeyRevokedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_REVOKED;
  constructor(payload: ApiKeyRevokedPayload) {
    super(payload);
  }
}

// --- Rotated ---
export interface ApiKeyRotatedPayload {
  oldId: string;
  newId: string;
  environmentId: string;
  actorId: string;
}

export class ApiKeyRotatedEvent extends DomainEvent<ApiKeyRotatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.API_KEY_ROTATED;
  constructor(payload: ApiKeyRotatedPayload) {
    super(payload);
  }
}
