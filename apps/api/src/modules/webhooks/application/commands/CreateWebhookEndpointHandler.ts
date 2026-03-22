import type { IWebhookEndpointRepository } from "@/modules/webhooks/application/ports/IWebhookEndpointRepository";
import type { IEventBus } from "@/modules/webhooks/application/ports/IEventBus";
import type { CreateWebhookEndpointCommand } from "@/modules/webhooks/application/commands/CreateWebhookEndpointCommand";
import { WebhookEndpointEntity } from "@/modules/webhooks/domain/WebhookEndpointEntity";
import { WebhookEndpointCreatedEvent } from "@/modules/webhooks/domain/events/WebhookEvents";

export class CreateWebhookEndpointHandler {
  constructor(
    private readonly repository: IWebhookEndpointRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async handle(command: CreateWebhookEndpointCommand): Promise<string> {
    const endpoint = WebhookEndpointEntity.create(command.url, command.events);

    await this.repository.save(endpoint);
    await this.eventBus.publish(new WebhookEndpointCreatedEvent(endpoint.id, endpoint.url));

    return endpoint.id;
  }
}
