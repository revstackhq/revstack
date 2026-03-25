import type { AddonEntity } from "@/modules/addons/domain/AddonEntity";

export interface AddonRepository {
  save(addon: AddonEntity): Promise<void>;
  saveMany(addons: AddonEntity[]): Promise<void>;
  findById(id: string): Promise<AddonEntity | null>;
  find(filters: { environmentId?: string; isArchived?: boolean }): Promise<AddonEntity[]>;
}
