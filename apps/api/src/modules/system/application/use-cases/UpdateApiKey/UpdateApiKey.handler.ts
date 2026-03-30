import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateApiKeyCommand } from "./UpdateApiKey.schema";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";

export class UpdateApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: UpdateApiKeyCommand) {
    const apiKey = await this.repository.findById(command.id);
    if (!apiKey) {
      throw new ApiKeyNotFoundError();
    }

    apiKey.update(command.name, command.scopes);

    await this.repository.save(apiKey);

    await this.eventBus.publish(apiKey.pullEvents());

    return apiKey.val.keyHash;
  }
}
