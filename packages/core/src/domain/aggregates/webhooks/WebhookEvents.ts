import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

export interface WebhookEndpointCreatedPayload {
  id: string;
  environmentId: string;
  url: string;
  events: string[];
}

export class WebhookEndpointCreatedEvent extends DomainEvent<WebhookEndpointCreatedPayload> {
  public readonly eventName: string = DOMAIN_EVENTS.WEBHOOK_ENDPOINT_CREATED;

  constructor(payload: WebhookEndpointCreatedPayload) {
    super(payload);
  }
}
