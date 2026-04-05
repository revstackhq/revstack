import type { AddonEntitlementEntity } from "@/domain/aggregates/addons/AddonEntitlementEntity";

export interface AddonEntitlementRepository {
  save(addonEntitlement: AddonEntitlementEntity): Promise<string>;
  findByAddonAndEntitlement(
    addonId: string,
    entitlementId: string,
  ): Promise<AddonEntitlementEntity | null>;
  find(filters: { addonId?: string }): Promise<AddonEntitlementEntity[]>;
  delete(id: string): Promise<boolean>;
}
