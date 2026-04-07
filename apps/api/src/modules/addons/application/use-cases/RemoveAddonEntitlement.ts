import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonNotFoundError, AddonRepository } from "@revstackhq/core";

export const RemoveAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1),
  environment_id: z.string().min(1),
  entitlement_id: z.string().min(1),
});

export type RemoveAddonEntitlementCommand = z.infer<
  typeof RemoveAddonEntitlementCommandSchema
>;

export const RemoveAddonEntitlementResponseSchema = z.object({
  success: z.boolean(),
});

export type RemoveAddonEntitlementResponse = z.infer<
  typeof RemoveAddonEntitlementResponseSchema
>;

export class RemoveAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: RemoveAddonEntitlementCommand,
  ): Promise<RemoveAddonEntitlementResponse> {
    const addon = await this.repository.findById({
      id: command.addon_id,
      environmentId: command.environment_id,
    });

    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.removeEntitlement(command.entitlement_id);

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    return { success: true };
  }
}
