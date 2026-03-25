import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import { AddonEntity } from "@/modules/addons/domain/AddonEntity";
import { addons } from "@revstackhq/db";

type AddonInsert = typeof addons.$inferInsert;
type AddonSelect = typeof addons.$inferSelect;

export class PostgresAddonRepo
  extends BasePostgresRepository<AddonEntity, AddonInsert, AddonSelect>
  implements AddonRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, addons);
  }

  protected toDomain(row: AddonSelect): AddonEntity {
    return AddonEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      name: row.name,
      type: row.type,
      isArchived: row.status === "archived",
      createdAt: row.updatedAt,
      updatedAt: row.updatedAt,
    });
  }

  protected toPersistence(entity: AddonEntity): AddonInsert {
    return {
      id: entity.id,
      environmentId: entity.environmentId,
      slug: entity.name.toLowerCase().replace(/\s+/g, "-"),
      name: entity.name,
      type: entity.type as any,
      amount: 0,
      currency: "USD",
      status: entity.isArchived ? ("archived" as const) : ("active" as const),
    };
  }

  async find(filters: { environmentId?: string; isArchived?: boolean }): Promise<AddonEntity[]> {
    const conditions = [];
    if (filters.environmentId) conditions.push(eq(addons.environmentId, filters.environmentId));
    if (filters.isArchived !== undefined) {
      conditions.push(eq(addons.status, filters.isArchived ? "archived" : "active"));
    }

    const rows = conditions.length > 0
      ? await this.db.select().from(this.table).where(and(...conditions))
      : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as AddonSelect));
  }

  async saveMany(addonEntities: AddonEntity[]): Promise<void> {
    if (addonEntities.length === 0) return;
    const dbRecords = addonEntities.map((e) => this.toPersistence(e));
    await this.db
      .insert(this.table)
      .values(dbRecords as any[])
      .onConflictDoNothing({ target: this.table.id });
  }
}
