import { eq } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
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
    super(db, customers);
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
      id: entity.id,
      environmentId: entity.environmentId,
      userId: entity.userId,
      providerId: entity.providerId,
      externalId: entity.externalId,
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
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

  async saveMany(customerEntities: CustomerEntity[]): Promise<void> {
    if (customerEntities.length === 0) return;
    const dbRecords = customerEntities.map(e => this.toPersistence(e));
    await this.db
      .insert(this.table)
      .values(dbRecords as any[])
      .onConflictDoNothing({ target: this.table.id });
  }
}
