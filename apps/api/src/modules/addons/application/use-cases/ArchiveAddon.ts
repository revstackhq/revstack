import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonNotFoundError, AddonRepository } from "@revstackhq/core";

export const ArchiveAddonCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type ArchiveAddonCommand = z.infer<typeof ArchiveAddonCommandSchema>;

export const ArchiveAddonResponseSchema = z.object({
  success: z.boolean(),
});

export type ArchiveAddonResponse = z.infer<typeof ArchiveAddonResponseSchema>;

export class ArchiveAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: ArchiveAddonCommand,
  ): Promise<ArchiveAddonResponse> {
    const addon = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.archive();

    await this.repository.save(addon);

    await this.eventBus.publish(addon.pullEvents());

    return { success: true };
  }
}
