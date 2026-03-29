import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateApiKeyCommand } from "@/modules/system/application/commands/CreateApiKeyCommand";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export class CreateApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async handle(command: CreateApiKeyCommand, environmentId: string) {
    const { entity, rawKey } = await ApiKeyEntity.create({
      name: command.name,
      type: command.type,
      scopes: command.scopes,
      environmentId,
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
