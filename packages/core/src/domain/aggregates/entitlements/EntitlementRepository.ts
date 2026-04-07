import type { EntitlementEntity } from "@/domain/aggregates/entitlements/EntitlementEntity";

export interface EntitlementRepository {
  save(entitlement: EntitlementEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<EntitlementEntity | null>;

  findBySlug(params: {
    slug: string;
    environmentId: string;
  }): Promise<EntitlementEntity | null>;

  findMany(params: { environmentId: string }): Promise<EntitlementEntity[]>;
}
