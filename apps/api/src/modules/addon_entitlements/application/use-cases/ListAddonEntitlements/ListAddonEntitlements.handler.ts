import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import type {
  ListAddonEntitlementsQuery,
  ListAddonEntitlementsResponse,
} from "./ListAddonEntitlements.schema";

export class ListAddonEntitlementsHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async execute(
    query: ListAddonEntitlementsQuery,
  ): Promise<ListAddonEntitlementsResponse> {
    const entities = await this.repository.find({
      addonId: query.addon_id,
    });

    return entities.map((e) => {
      const v = e.val;
      return {
        id: v.id!,
        addon_id: v.addonId,
        entitlement_id: v.entitlementId,
        metadata: v.metadata,
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      };
    });
  }
}
