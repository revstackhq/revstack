import { Entity } from "@/common/domain/Entity";
import { eq, SQL } from "drizzle-orm";
import { PgDatabase, PgTable, PgColumn } from "drizzle-orm/pg-core";

export abstract class BasePostgresRepository<
  TEntity extends Entity<any>,
  TDbInsert,
  TDbSelect extends object,
> {
  constructor(
    protected readonly db: PgDatabase<any, any, any>,
    protected readonly table: PgTable<any>,
    protected readonly columns: {
      id: PgColumn<any>;
      environmentId?: PgColumn<any>;
    },
  ) {}

  protected abstract toDomain(row: TDbSelect): TEntity;
  protected abstract toPersistence(entity: TEntity): TDbInsert;

  async findById(id: string): Promise<TEntity | null> {
    const [row] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.id, id));

    return row ? this.toDomain(row as TDbSelect) : null;
  }

  async findByEnvironment(
    environmentId: string,
    options: { limit?: number; offset?: number } = { limit: 10, offset: 0 },
  ): Promise<TEntity[]> {
    if (!this.columns.environmentId) {
      throw new Error(
        `The table ${this.table._.name} does not support environment isolation.`,
      );
    }

    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(this.columns.environmentId, environmentId))
      .limit(options.limit ?? 10)
      .offset(options.offset ?? 0);

    return rows.map((row) => this.toDomain(row as TDbSelect));
  }

  async save(entity: TEntity): Promise<string> {
    const dbRecord = this.toPersistence(entity);

    const currentId = entity.val.id;

    if (currentId) {
      await this.db
        .update(this.table)
        .set(dbRecord as any)
        .where(eq(this.columns.id, currentId));

      return currentId;
    }

    const [result] = await this.db
      .insert(this.table)
      .values(dbRecord as any)
      .returning({ id: this.columns.id });

    const returnedId = result?.id as string;

    if (returnedId) {
      entity.assignId(returnedId);
    }

    return returnedId;
  }

  async saveMany(entities: TEntity[]): Promise<void> {
    if (entities.length === 0) return;

    const records = entities.map((entity) => this.toPersistence(entity));

    await this.db
      .insert(this.table)
      .values(records as any)
      .onConflictDoNothing();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.columns.id, id));

    return (result.rowCount ?? 0) > 0;
  }
}
