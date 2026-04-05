import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";
import { EntitlementDeletedEvent } from "@revstackhq/core";

export const DeleteEntitlementCommandSchema = z.object({
  id: z.string().min(1),
});

export type DeleteEntitlementCommand = z.infer<typeof DeleteEntitlementCommandSchema>;

export class DeleteEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: DeleteEntitlementCommand) {
    const entitlement = await this.repository.findById(command.id);
    if (!entitlement) {
      throw new NotFoundError("Entitlement not found", "ENTITLEMENT_NOT_FOUND");
    }

    const success = await this.repository.delete(command.id);
    if (!success) {
      throw new Error("Failed to delete entitlement");
    }

    await this.eventBus.publish(
      new EntitlementDeletedEvent({
        environmentId: entitlement.val.environmentId,
        id: entitlement.val.id!,
      }),
    );

    return { success: true };
  }
}
