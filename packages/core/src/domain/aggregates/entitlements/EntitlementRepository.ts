import type { EntitlementEntity } from "@/domain/aggregates/entitlements/EntitlementEntity";

export interface EntitlementRepository {
  save(entitlement: EntitlementEntity): Promise<void>;
  findById(id: string): Promise<EntitlementEntity | null>;
  findAll(): Promise<EntitlementEntity[]>;
  delete(id: string): Promise<boolean>;
}
