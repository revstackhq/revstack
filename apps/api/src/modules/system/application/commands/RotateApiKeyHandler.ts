import { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@/common/errors/DomainError";
import { RotateApiKeyCommand } from "@/modules/system/application/commands/RotateApiKeyCommand";
import { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";

export class RotateApiKeyHandler {
  constructor(
    private readonly repo: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(command: RotateApiKeyCommand): Promise<string> {
    const apiKey = await this.repo.findById(command.id);

    if (!apiKey) {
      throw new NotFoundError("Api key not found", "NOT_FOUND");
    }

    const newRawKey = await apiKey.rotate(command.actor_id);

    await this.repo.save(apiKey);

    await this.eventBus.publish(apiKey.pullEvents());

    return newRawKey;
  }
}
