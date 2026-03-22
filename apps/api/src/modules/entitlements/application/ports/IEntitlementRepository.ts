import type { EntitlementEntity } from "@/modules/entitlements/domain/EntitlementEntity";

export interface IEntitlementRepository {
  save(entitlement: EntitlementEntity): Promise<void>;
  findById(id: string): Promise<EntitlementEntity | null>;
  findAll(): Promise<EntitlementEntity[]>;
  delete(id: string): Promise<boolean>;
}
