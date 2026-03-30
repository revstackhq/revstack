import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntitlementNotFoundError } from "@/modules/addon_entitlements/domain/AddonEntitlementErrors";
import type {
  DeleteAddonEntitlementCommand,
  DeleteAddonEntitlementResponse,
} from "./DeleteAddonEntitlement.schema";

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
