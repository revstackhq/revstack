import { eq } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerEntity } from "@revstackhq/core";
import { customers } from "@revstackhq/db";

export class PostgresCustomerRepository
  extends BasePostgresRepository<
    CustomerEntity,
    typeof customers.$inferInsert,
    typeof customers.$inferSelect
  >
  implements CustomerRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, customers, {
      id: customers.id,
      environmentId: customers.environmentId,
    });
  }

  protected toDomain(row: typeof customers.$inferSelect): CustomerEntity {
    return CustomerEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      userId: row.userId,
      providerId: row.providerId,
      externalId: row.externalId,
      email: row.email,
      name: row.name,
      phone: row.phone,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(
    entity: CustomerEntity,
  ): typeof customers.$inferInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environmentId,
      userId: entity.val.userId,
      providerId: entity.val.providerId,
      externalId: entity.val.externalId,
      email: entity.val.email,
      name: entity.val.name,
      phone: entity.val.phone,
      metadata: entity.val.metadata,
      createdAt: entity.val.createdAt,
    };
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(customers.email, email));

    const row = rows[0];
    return row ? this.toDomain(row as typeof customers.$inferSelect) : null;
  }

  async findAll(): Promise<CustomerEntity[]> {
    const rows = await this.db.select().from(this.table);

    return rows.map((row) =>
      this.toDomain(row as typeof customers.$inferSelect),
    );
  }
}
