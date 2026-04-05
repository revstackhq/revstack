import type { WebhookEndpointRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export interface DeactivateWebhookEndpointCommand {
  id: string;
}

export class DeactivateWebhookEndpointHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: DeactivateWebhookEndpointCommand) {
    const endpoint = await this.repository.findById(command.id);
    if (!endpoint) {
      throw new NotFoundError("Webhook endpoint not found", "WEBHOOK_NOT_FOUND");
    }

    endpoint.deactivate();
    await this.repository.save(endpoint);
    await this.eventBus.publish({ eventName: "webhook.endpoint_deactivated", endpointId: endpoint.id });

    return { id: endpoint.id, status: endpoint.status };
  }
}
