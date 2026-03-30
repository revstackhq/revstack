import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateWebhookEndpointCommand } from "./CreateWebhookEndpoint.schema";
import { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";
import { WebhookEndpointCreatedEvent } from "@/modules/webhooks/domain/events/WebhookEvents";

export class CreateWebhookEndpointHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateWebhookEndpointCommand): Promise<string> {
    const endpoint = WebhookEndpointEntity.create(command.url, command.events);

    await this.repository.save(endpoint);
    await this.eventBus.publish(new WebhookEndpointCreatedEvent(endpoint.id, endpoint.url));

    return endpoint.id;
  }
}
