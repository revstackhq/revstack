import type { RefundRepository } from "@/modules/refunds/application/ports/RefundRepository";
import type { RefundEntity } from "@/modules/refunds/domain/RefundEntity";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class PostgresRefundRepo implements RefundRepository {
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
