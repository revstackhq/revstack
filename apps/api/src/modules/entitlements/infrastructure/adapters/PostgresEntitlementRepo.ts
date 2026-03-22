import type { IEntitlementRepository } from "@/modules/entitlements/application/ports/IEntitlementRepository";
import type { EntitlementEntity } from "@/modules/entitlements/domain/EntitlementEntity";

export class PostgresEntitlementRepo implements IEntitlementRepository {
  constructor(private readonly db: any) {}

  async save(entitlement: EntitlementEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<EntitlementEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<EntitlementEntity[]> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
