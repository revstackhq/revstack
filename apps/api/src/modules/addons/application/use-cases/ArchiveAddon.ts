import { z } from "zod";
import { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonNotFoundError } from "@revstackhq/core";
import { PostgresAddonRepository } from "@/modules/addons/infrastructure/adapters/PostgresAddonRepository";

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
    private readonly db: DrizzleDB,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: ArchiveAddonCommand,
  ): Promise<ArchiveAddonResponse> {
    const repository = new PostgresAddonRepository(
      this.db,
      command.environment_id,
    );

    const addon = await repository.findById(command.id);

    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.archive();

    await repository.save(addon);

    await this.eventBus.publish(addon.pullEvents());

    return { success: true };
  }
}
