import type { EntitlementRepository } from "@/modules/entitlements/application/ports/EntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteEntitlementCommand } from "./DeleteEntitlement.schema";
import { NotFoundError } from "@/common/errors/DomainError";
import { EntitlementDeletedEvent } from "@/modules/entitlements/domain/events/EntitlementEvents";

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
