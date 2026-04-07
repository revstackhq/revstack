import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonNotFoundError, AddonRepository } from "@revstackhq/core";

export const UpdateAddonCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateAddonCommand = z.infer<typeof UpdateAddonCommandSchema>;

export const UpdateAddonResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateAddonResponse = z.infer<typeof UpdateAddonResponseSchema>;

export class UpdateAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: UpdateAddonCommand,
  ): Promise<UpdateAddonResponse> {
    const addon = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.update({
      name: command.name,
      description: command.description ?? undefined,
      status: command.status,
      metadata: command.metadata,
    });

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    return { success: true };
  }
}
