import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";

export class DeleteApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: { keyId: string }) {
    const apiKey = await this.repository.findById(command.keyId);
    if (!apiKey) {
      throw new ApiKeyNotFoundError();
    }

    await this.repository.delete(command.keyId);
    return { success: true };
  }
}
