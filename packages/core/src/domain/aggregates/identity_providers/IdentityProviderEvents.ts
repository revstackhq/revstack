import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";
import { ExternalAuthProvider } from "./IdentityProviderEntity";

export interface IdentityProviderCreatedPayload {
  id: string;
  environmentId: string;
  vendor: ExternalAuthProvider;
}

export class IdentityProviderCreatedEvent extends DomainEvent<IdentityProviderCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.IDENTITY_PROVIDER_CREATED;
  constructor(payload: IdentityProviderCreatedPayload) {
    super(payload);
  }
}

export interface IdentityProviderUpdatedPayload {
  id: string;
  environmentId: string;
  changes: string[];
}

export class IdentityProviderUpdatedEvent extends DomainEvent<IdentityProviderUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.IDENTITY_PROVIDER_UPDATED;
  constructor(payload: IdentityProviderUpdatedPayload) {
    super(payload);
  }
}

export interface IdentityProviderDeletedPayload {
  id: string;
  environmentId: string;
}

export class IdentityProviderDeletedEvent extends DomainEvent<IdentityProviderDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.IDENTITY_PROVIDER_DELETED;
  constructor(payload: IdentityProviderDeletedPayload) {
    super(payload);
  }
}
