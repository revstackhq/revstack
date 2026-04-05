import { z } from "zod";
import type { WebhookEndpointRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { WebhookEndpointEntity } from "@revstackhq/core";
import { WebhookEndpointCreatedEvent } from "@revstackhq/core";

export const createWebhookEndpointSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  environment_id: z.string(),
  events: z.array(z.string()).min(1, "At least one event is required"),
});

export type CreateWebhookEndpointCommand = z.infer<
  typeof createWebhookEndpointSchema
>;

export class CreateWebhookEndpointHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateWebhookEndpointCommand): Promise<string> {
    const endpoint = WebhookEndpointEntity.create({
      environmentId: command.environment_id,
      url: command.url,
      events: command.events,
    });

    await this.repository.save(endpoint);

    await this.eventBus.publish(
      new WebhookEndpointCreatedEvent({
        id: endpoint.val.id!,
        environmentId: command.environment_id,
        url: endpoint.val.url,
        events: endpoint.val.events,
      }),
    );

    return endpoint.val.id!;
  }
}
