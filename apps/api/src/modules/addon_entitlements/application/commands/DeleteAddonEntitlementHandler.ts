import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteAddonEntitlementCommand } from "@/modules/addon_entitlements/application/commands/DeleteAddonEntitlementCommand";
import { AddonEntitlementNotFoundError } from "@/modules/addon_entitlements/domain/AddonEntitlementErrors";

export class DeleteAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonEntitlementRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: DeleteAddonEntitlementCommand) {
    const addonEntitlement = await this.repository.findByAddonAndEntitlement(command.addonId, command.entitlementId);
    if (!addonEntitlement) {
      throw new AddonEntitlementNotFoundError();
    }

    await this.repository.delete(addonEntitlement.id);
    await this.eventBus.publish({ eventName: "addon_entitlement.deleted", id: addonEntitlement.id, addonId: command.addonId });

    return { success: true };
  }
}
