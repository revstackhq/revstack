import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type { GetAddonEntitlementQuery } from "@/modules/addon_entitlements/application/queries/GetAddonEntitlementQuery";
import { AddonEntitlementNotFoundError } from "@/modules/addon_entitlements/domain/AddonEntitlementErrors";

export class GetAddonEntitlementHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async handle(query: GetAddonEntitlementQuery) {
    const addonEntitlement = await this.repository.findByAddonAndEntitlement(query.addonId, query.entitlementId);
    if (!addonEntitlement) {
      throw new AddonEntitlementNotFoundError();
    }
    return addonEntitlement.toPrimitives();
  }
}
