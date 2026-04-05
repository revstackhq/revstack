import type { AddonEntity } from "@/domain/aggregates/addons/AddonEntity";
import type { PricingType, PlanStatus } from "@/types/index";
import type { PaginatedCursorResult } from "@/types/pagination";

export interface AddonRepository {
  save(addon: AddonEntity): Promise<void>;
  saveMany(addons: AddonEntity[]): Promise<void>;

  findById(id: string): Promise<AddonEntity | null>;
  findBySlug(slug: string): Promise<AddonEntity | null>;

  findMany(params: {
    status?: PlanStatus;
    type?: PricingType;
    limit: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<AddonEntity>>;
}
