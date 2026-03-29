import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface CustomerCreatedPayload {
  id: string;
  environmentId: string;
}

export class CustomerCreatedEvent extends DomainEvent<CustomerCreatedPayload> {
  public readonly eventName = "customer.created";

  constructor(payload: CustomerCreatedPayload) {
    super(payload);
  }
}

export interface CustomerDeletedPayload {
  id: string;
  environmentId: string;
}

export class CustomerDeletedEvent extends DomainEvent<CustomerDeletedPayload> {
  public readonly eventName = "customer.deleted";

  constructor(payload: CustomerDeletedPayload) {
    super(payload);
  }
}
