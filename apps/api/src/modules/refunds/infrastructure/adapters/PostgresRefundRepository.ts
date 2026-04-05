import type { RefundRepository } from "@revstackhq/core";
import type { RefundEntity } from "@revstackhq/core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class PostgresRefundRepository implements RefundRepository {
  constructor(private readonly db: PostgresJsDatabase<any>) {}

  public async save(refund: RefundEntity): Promise<void> {
    // Scaffolded implementation
  }

  public async findById(id: string): Promise<RefundEntity | null> {
    // Scaffolded implementation
    return null;
  }

  public async find(filters?: { paymentId?: string; status?: string }): Promise<RefundEntity[]> {
    // Scaffolded implementation
    return [];
  }
}
