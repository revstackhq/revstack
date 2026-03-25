import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export class RotateApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: { keyId: string }) {
    const oldApiKey = await this.repository.findById(command.keyId);
    if (!oldApiKey) {
      throw new ApiKeyNotFoundError();
    }

    // Create a new key with same specs
    const { entity: newApiKey, rawKey } = ApiKeyEntity.create({
      environmentId: oldApiKey.environmentId,
      name: oldApiKey.name,
      type: oldApiKey.type,
      scopes: oldApiKey.scopes,
    });

    // Save new
    await this.repository.save(newApiKey);

    // Delete old
    await this.repository.delete(oldApiKey.id);

    return {
      key: rawKey,
      name: newApiKey.name,
      environmentId: newApiKey.environmentId,
      type: newApiKey.type,
      scopes: newApiKey.scopes,
      createdAt: newApiKey.createdAt,
    };
  }
}
