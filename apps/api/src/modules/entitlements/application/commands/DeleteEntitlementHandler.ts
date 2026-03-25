import type { EntitlementRepository } from "@/modules/entitlements/application/ports/EntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteEntitlementCommand } from "@/modules/entitlements/application/commands/DeleteEntitlementCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class DeleteEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async handle(command: DeleteEntitlementCommand) {
    const entitlement = await this.repository.findById(command.id);
    if (!entitlement) {
      throw new NotFoundError("Entitlement not found", "ENTITLEMENT_NOT_FOUND");
    }

    const success = await this.repository.delete(command.id);
    if (!success) {
      throw new Error("Failed to delete entitlement");
    }

    await this.eventBus.publish({
      eventName: "entitlement.deleted",
      id: entitlement.id,
    });

    return { success: true };
  }
}
