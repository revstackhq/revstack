import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface CustomerCreatedPayload {
  id: string;
  environmentId: string;
}

export class CustomerCreatedEvent extends DomainEvent<CustomerCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.CUSTOMER_CREATED;

  constructor(payload: CustomerCreatedPayload) {
    super(payload);
  }
}

export interface CustomerDeletedPayload {
  id: string;
  environmentId: string;
}

export class CustomerDeletedEvent extends DomainEvent<CustomerDeletedPayload> {
  public readonly eventName = DOMAIN_EVENTS.CUSTOMER_DELETED;

  constructor(payload: CustomerDeletedPayload) {
    super(payload);
  }
}
