import { z } from "zod";
import { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";
import { ApiKeyRepository } from "@revstackhq/core";

export const rotateApiKeyCommandSchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
  actor_id: z.string(),
});

export type RotateApiKeyCommand = z.infer<typeof rotateApiKeyCommandSchema>;

export class RotateApiKeyHandler {
  constructor(
    private readonly repo: ApiKeyRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RotateApiKeyCommand): Promise<string> {
    const apiKey = await this.repo.findById(command.id);

    if (!apiKey) {
      throw new NotFoundError("Api key not found", "NOT_FOUND");
    }

    const newRawKey = await apiKey.rotate(command.actor_id);

    await this.repo.save(apiKey);

    await this.eventBus.publish(apiKey.pullEvents());

    return newRawKey;
  }
}
