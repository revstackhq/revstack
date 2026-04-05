import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

// --- Price Events ---

export interface PriceCreatedPayload {
  id: string;
  planId: string;
  environmentId: string;
}

export class PriceCreatedEvent extends DomainEvent<PriceCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.PRICE_CREATED;
  constructor(payload: PriceCreatedPayload) {
    super(payload);
  }
}

export class PriceUpdatedEvent extends DomainEvent<PriceCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.PRICE_UPDATED;
  constructor(payload: PriceCreatedPayload) {
    super(payload);
  }
}

export class PriceVersionedEvent extends DomainEvent<{ oldId: string; newId: string; environmentId: string }> {
  public readonly eventName = DOMAIN_EVENTS.PRICE_VERSIONED;
  constructor(payload: { oldId: string; newId: string; environmentId: string }) {
    super(payload);
  }
}
