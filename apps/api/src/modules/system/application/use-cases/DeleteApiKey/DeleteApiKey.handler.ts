import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";
import { DeleteApiKeyCommand } from "./DeleteApiKey.schema";

export class DeleteApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: DeleteApiKeyCommand) {
    const apiKey = await this.repository.findById(command.id);
    if (!apiKey) {
      throw new ApiKeyNotFoundError();
    }

    await this.repository.delete(command.id);

    await this.eventBus.publish(apiKey.pullEvents());

    return { success: true };
  }
}
