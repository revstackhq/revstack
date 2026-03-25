import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type { ListAddonEntitlementsQuery } from "@/modules/addon_entitlements/application/queries/ListAddonEntitlementsQuery";

export class ListAddonEntitlementsHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async handle(query: ListAddonEntitlementsQuery) {
    const addonEntitlements = await this.repository.find({
      addonId: query.addonId,
    });
    return addonEntitlements.map(ae => ae.toPrimitives());
  }
}
