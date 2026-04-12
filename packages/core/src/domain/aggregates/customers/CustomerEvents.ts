import { DOMAIN_EVENTS } from "@/constants";
import { DomainEvent } from "@/domain/base/DomainEvent";

export interface CustomerCreatedPayload {
  id: string;
  environmentId: string;
  externalId: string;
  email: string;
}

export class CustomerCreatedEvent extends DomainEvent<CustomerCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.CUSTOMER_CREATED;
  constructor(payload: CustomerCreatedPayload) {
    super(payload);
  }
}

export interface CustomerUpdatedPayload {
  id: string;
  environmentId: string;
  changes: string[];
}

export class CustomerUpdatedEvent extends DomainEvent<CustomerUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.CUSTOMER_UPDATED;
  constructor(payload: CustomerUpdatedPayload) {
    super(payload);
  }
}

export interface CustomerArchivedPayload {
  id: string;
  environmentId: string;
}

export class CustomerArchivedEvent extends DomainEvent<CustomerArchivedPayload> {
  public readonly eventName = DOMAIN_EVENTS.CUSTOMER_ARCHIVED;
  constructor(payload: CustomerArchivedPayload) {
    super(payload);
  }
}
