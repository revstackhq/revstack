import type { WebhookEndpointRepository } from "@/modules/webhooks/application/ports/WebhookEndpointRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { RotateWebhookSecretCommand } from "@/modules/webhooks/application/commands/RotateWebhookSecretCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class RotateWebhookSecretHandler {
  constructor(
    private readonly repository: WebhookEndpointRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: RotateWebhookSecretCommand) {
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
