import type { IApiKeyRepository } from "@/modules/system/application/ports/IApiKeyRepository";
import type { IEventBus } from "@/common/application/ports/IEventBus";
import type { CreateApiKeyCommand } from "@/modules/system/application/commands/CreateApiKeyCommand";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";
import { ApiKeyCreatedEvent } from "@/modules/system/domain/events/ApiKeyEvents";

export class CreateApiKeyHandler {
  constructor(
    private readonly repository: IApiKeyRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async handle(command: CreateApiKeyCommand): Promise<{ id: string, rawKey: string }> {
    const { entity, rawKey } = ApiKeyEntity.create(command.tenantId, command.name);

    await this.repository.save(entity);
    await this.eventBus.publish(new ApiKeyCreatedEvent(entity.id, entity.tenantId));

    return { id: entity.id, rawKey };
  }
}
