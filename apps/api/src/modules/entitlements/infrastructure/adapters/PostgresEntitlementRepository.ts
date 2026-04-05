import type {
  EntitlementEntity,
  EntitlementRepository,
} from "@revstackhq/core";

export class PostgresEntitlementRepository implements EntitlementRepository {
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
