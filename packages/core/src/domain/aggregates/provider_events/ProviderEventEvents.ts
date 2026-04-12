import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants";

export interface ProviderEventIngestedPayload {
  id: string;
  externalEventId: string;
  eventType: string;
  environmentId: string;
}

export class ProviderEventIngestedEvent extends DomainEvent<ProviderEventIngestedPayload> {
  public readonly eventName = DOMAIN_EVENTS.PROVIDER_EVENT_INGESTED;
  constructor(payload: ProviderEventIngestedPayload) {
    super(payload);
  }
}

export interface ProviderEventProcessedPayload {
  id: string;
  externalEventId: string;
  resourceId: string;
  environmentId: string;
}

export class ProviderEventProcessedEvent extends DomainEvent<ProviderEventProcessedPayload> {
  public readonly eventName = DOMAIN_EVENTS.PROVIDER_EVENT_PROCESSED;
  constructor(payload: ProviderEventProcessedPayload) {
    super(payload);
  }
}
