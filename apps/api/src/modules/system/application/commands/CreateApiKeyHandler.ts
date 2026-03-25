import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateApiKeyCommand } from "@/modules/system/application/commands/CreateApiKeyCommand";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";
import { ApiKeyCreatedEvent } from "@/modules/system/domain/events/ApiKeyEvents";

export class CreateApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateApiKeyCommand) {
    const { entity, rawKey } = ApiKeyEntity.create({
      environmentId: command.environmentId,
      name: command.name,
      type: command.type,
      scopes: command.scopes,
    });

    await this.repository.save(entity);

    await this.eventBus.publish(
      new ApiKeyCreatedEvent(entity.id, entity.environmentId)
    );

    return {
      key: rawKey,
      name: entity.name,
      environmentId: entity.environmentId,
      type: entity.type,
      scopes: entity.scopes,
      createdAt: entity.createdAt,
    };
  }
}
