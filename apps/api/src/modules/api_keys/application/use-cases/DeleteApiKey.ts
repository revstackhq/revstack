import { z } from "zod";
import type { ApiKeyRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { ApiKeyNotFoundError } from "@revstackhq/core";

export const deleteApiKeyCommandSchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
});

export type DeleteApiKeyCommand = z.infer<typeof deleteApiKeyCommandSchema>;

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
