import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AddonEntitlementRepository } from "@/modules/addon_entitlements/application/ports/AddonEntitlementRepository";
import { AddonEntitlementEntity } from "@/modules/addon_entitlements/domain/AddonEntitlementEntity";
import { addonEntitlements } from "@revstackhq/db";

type AddonEntitlementInsert = typeof addonEntitlements.$inferInsert;
type AddonEntitlementSelect = typeof addonEntitlements.$inferSelect;

export class PostgresAddonEntitlementRepo
  extends BasePostgresRepository<
    AddonEntitlementEntity,
    AddonEntitlementInsert,
    AddonEntitlementSelect
  >
  implements AddonEntitlementRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, addonEntitlements, {
      id: addonEntitlements.id,
    });
  }

  protected toDomain(row: AddonEntitlementSelect): AddonEntitlementEntity {
    return AddonEntitlementEntity.restore({
      id: row.id,
      addon_id: row.addonId,
      entitlement_id: row.entitlementId,
      created_at: row.createdAt ?? new Date(),
      updated_at: row.updatedAt ?? new Date(),
    });
  }

  protected toPersistence(
    entity: AddonEntitlementEntity,
  ): AddonEntitlementInsert {
    return {
      id: entity.val.id,
      addonId: entity.val.addon_id,
      entitlementId: entity.val.entitlement_id,
    };
  }

  async findByAddonAndEntitlement(
    addonId: string,
    entitlementId: string,
  ): Promise<AddonEntitlementEntity | null> {
    const [row] = await this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(addonEntitlements.addonId, addonId),
          eq(addonEntitlements.entitlementId, entitlementId),
        ),
      );

    return row ? this.toDomain(row as AddonEntitlementSelect) : null;
  }

  async find(filters: {
    addonId?: string;
  }): Promise<AddonEntitlementEntity[]> {
    const conditions = [];
    if (filters.addonId)
      conditions.push(eq(addonEntitlements.addonId, filters.addonId));

    const rows =
      conditions.length > 0
        ? await this.db
            .select()
            .from(this.table)
            .where(and(...conditions))
        : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as AddonEntitlementSelect));
  }
}
