import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import { AddonEntitlementNotFoundError } from "@/modules/addon_entitlements/domain/AddonEntitlementErrors";
import type {
  GetAddonEntitlementQuery,
  GetAddonEntitlementResponse,
} from "./GetAddonEntitlement.schema";

export class GetAddonEntitlementHandler {
  constructor(private readonly repository: AddonEntitlementRepository) {}

  public async execute(
    query: GetAddonEntitlementQuery,
  ): Promise<GetAddonEntitlementResponse> {
    const entity = await this.repository.findByAddonAndEntitlement(
      query.addon_id,
      query.entitlement_id,
    );

    if (!entity) {
      throw new AddonEntitlementNotFoundError();
    }

    const v = entity.val;
    return {
      id: v.id!,
      addon_id: v.addonId,
      entitlement_id: v.entitlementId,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
