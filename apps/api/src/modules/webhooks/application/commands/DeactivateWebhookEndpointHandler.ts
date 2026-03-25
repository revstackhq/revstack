import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeactivateWebhookEndpointCommand } from "@/modules/webhooks/application/commands/DeactivateWebhookEndpointCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class DeactivateWebhookEndpointHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: DeactivateWebhookEndpointCommand) {
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
