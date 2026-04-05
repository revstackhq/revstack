import { z } from "zod";
import type { ApiKeyRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyEntity } from "@revstackhq/core";

export const createApiKeySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["public", "secret"]),
  scopes: z.array(z.string()).default([]),
});

export type CreateApiKeyCommand = z.infer<typeof createApiKeySchema>;

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
