import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateAddonEntitlementCommand } from "@/modules/addon_entitlements/application/commands/CreateAddonEntitlementCommand";
import { AddonEntitlementEntity } from "@/modules/addon_entitlements/domain/AddonEntitlementEntity";
import { DomainError } from "@/common/errors/DomainError";

export class CreateAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonEntitlementRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateAddonEntitlementCommand) {
    const existing = await this.repository.findByAddonAndEntitlement(command.addonId, command.entitlementId);
    if (existing) {
        throw new DomainError("Addon already has this entitlement", 409, "ALREADY_EXISTS");
    }

    const addonEntitlement = AddonEntitlementEntity.create(command);

    await this.repository.save(addonEntitlement);
    await this.eventBus.publish({ eventName: "addon_entitlement.created", id: addonEntitlement.id, addonId: command.addonId });

    return addonEntitlement.toPrimitives();
  }
}
