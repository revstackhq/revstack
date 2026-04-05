import { z } from "zod";
import type { ApiKeyRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyNotFoundError } from "@revstackhq/core";

export const updateApiKeySchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
  name: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type UpdateApiKeyCommand = z.infer<typeof updateApiKeySchema>;

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
