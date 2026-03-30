import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateApiKeyCommand } from "./CreateApiKey.schema";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export class CreateApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateApiKeyCommand) {
    const { entity, rawKey } = await ApiKeyEntity.create({
      environmentId: command.environment_id,
      name: command.name,
      type: command.type,
      scopes: command.scopes,
    });

    await this.repository.save(entity);

    await this.eventBus.publish(entity.pullEvents());

    return {
      key: rawKey,
      name: entity.val.name,
      environmentId: entity.val.environmentId,
      type: entity.val.type,
      scopes: entity.val.scopes,
      createdAt: entity.val.createdAt,
    };
  }
}
