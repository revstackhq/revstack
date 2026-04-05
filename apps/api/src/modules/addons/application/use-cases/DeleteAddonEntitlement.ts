import { z } from "zod";
import type { AddonEntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntitlementNotFoundError } from "@revstackhq/core";

// Input DTO
export const DeleteAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
  entitlement_id: z.string().min(1, "Entitlement ID is required"),
});

export type DeleteAddonEntitlementCommand = z.infer<
  typeof DeleteAddonEntitlementCommandSchema
>;

// Output DTO
export const DeleteAddonEntitlementResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteAddonEntitlementResponse = z.infer<
  typeof DeleteAddonEntitlementResponseSchema
>;

export class DeleteAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonEntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: DeleteAddonEntitlementCommand,
  ): Promise<DeleteAddonEntitlementResponse> {
    const entity = await this.repository.findByAddonAndEntitlement(
      command.addon_id,
      command.entitlement_id,
    );

    if (!entity) {
      throw new AddonEntitlementNotFoundError();
    }

    entity.markDeleted();

    await this.repository.delete(entity.val.id!);
    await this.eventBus.publish(entity.pullEvents());

    return { success: true };
  }
}
