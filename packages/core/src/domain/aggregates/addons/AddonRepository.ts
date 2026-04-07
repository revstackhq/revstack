import type {
  AddonEntity,
  AddonStatus,
} from "@/domain/aggregates/addons/AddonEntity";
import type { PaginatedCursorResult as PaginatedResult } from "@/types/pagination";

export interface AddonRepository {
  save(addon: AddonEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<AddonEntity | null>;

  findBySlug(params: {
    slug: string;
    environmentId: string;
  }): Promise<AddonEntity | null>;

  list(params: {
    environmentId: string;
    status?: AddonStatus;
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedResult<AddonEntity>>;
}
