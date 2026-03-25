import { eq } from "drizzle-orm";
import { PgDatabase, PgTable, PgColumn } from "drizzle-orm/pg-core";

export abstract class BasePostgresRepository<
  TEntity,
  TDbInsert,
  TDbSelect extends object,
> {
  constructor(
    protected readonly db: PgDatabase<any, any, any>,
    protected readonly table: PgTable & { id: PgColumn },
  ) {}

  protected abstract toDomain(row: TDbSelect): TEntity;
  protected abstract toPersistence(entity: TEntity): TDbInsert;

  async findById(id: string): Promise<TEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));

    const row = rows[0];
    if (!row) return null;

    return this.toDomain(row as TDbSelect);
  }

  async save(entity: TEntity): Promise<void> {
    const dbRecord = this.toPersistence(entity);

    await this.db
      .insert(this.table)
      .values(dbRecord as any)
      .onConflictDoUpdate({
        target: this.table.id,
        set: dbRecord as any,
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.table.id, id));
  }
}
