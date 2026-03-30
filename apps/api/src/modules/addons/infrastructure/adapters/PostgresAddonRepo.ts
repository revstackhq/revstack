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
    super(db, addons, {
      id: addons.id,
      environmentId: addons.environmentId,
    });
  }

  protected toDomain(row: AddonSelect): AddonEntity {
    return AddonEntity.restore({
      id: row.id,
      environment_id: row.environmentId,
      name: row.name,
      type: row.type,
      is_archived: row.status === "archived",
      created_at: row.updatedAt,
      updated_at: row.updatedAt,
    });
  }

  protected toPersistence(entity: AddonEntity): AddonInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environment_id,
      slug: entity.val.name.toLowerCase().replace(/\s+/g, "-"),
      name: entity.val.name,
      type: entity.val.type as any,
      amount: 0,
      currency: "USD",
      status: entity.val.is_archived
        ? ("archived" as const)
        : ("active" as const),
    };
  }

  async find(filters: {
    environmentId?: string;
    isArchived?: boolean;
  }): Promise<AddonEntity[]> {
    const conditions = [];
    if (filters.environmentId)
      conditions.push(eq(addons.environmentId, filters.environmentId));
    if (filters.isArchived !== undefined) {
      conditions.push(
        eq(addons.status, filters.isArchived ? "archived" : "active"),
      );
    }

    const rows =
      conditions.length > 0
        ? await this.db
            .select()
            .from(this.table)
            .where(and(...conditions))
        : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as AddonSelect));
  }
}
