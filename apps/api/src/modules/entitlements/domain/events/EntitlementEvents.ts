import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface EntitlementCreatedPayload {
  id: string;
  environmentId: string;
}

export class EntitlementCreatedEvent extends DomainEvent<EntitlementCreatedPayload> {
  public readonly eventName = "entitlement.created";

  constructor(payload: EntitlementCreatedPayload) {
    super(payload);
  }
}

export interface EntitlementDeletedPayload {
  id: string;
  environmentId: string;
}

export class EntitlementDeletedEvent extends DomainEvent<EntitlementDeletedPayload> {
  public readonly eventName = "entitlement.deleted";

  constructor(payload: EntitlementDeletedPayload) {
    super(payload);
  }
}
