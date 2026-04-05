import type { WebhookEndpointRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export interface RotateWebhookSecretCommand {
  id: string;
}

export class RotateWebhookSecretHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: RotateWebhookSecretCommand) {
    const endpoint = await this.repository.findById(command.id);
    if (!endpoint) {
      throw new NotFoundError("Webhook endpoint not found", "WEBHOOK_NOT_FOUND");
    }

    const { secret, oldSecret } = endpoint.rotateSecret();
    await this.repository.save(endpoint);
    await this.eventBus.publish({ eventName: "webhook.secret_rotated", endpointId: endpoint.id });

    return { id: endpoint.id, secret, oldSecret };
  }
}
