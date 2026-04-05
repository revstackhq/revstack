import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { PlanEntitlementRepository } from "@revstackhq/core";
import { PlanEntitlementEntity } from "@revstackhq/core";
import { planEntitlements } from "@revstackhq/db";

type PlanEntitlementInsert = typeof planEntitlements.$inferInsert;
type PlanEntitlementSelect = typeof planEntitlements.$inferSelect;

export class PostgresPlanEntitlementRepository
  extends BasePostgresRepository<PlanEntitlementEntity, PlanEntitlementInsert, PlanEntitlementSelect>
  implements PlanEntitlementRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, planEntitlements);
  }

  protected toDomain(row: PlanEntitlementSelect): PlanEntitlementEntity {
    return PlanEntitlementEntity.restore({
      id: row.id,
      planId: row.planId,
      entitlementId: row.entitlementId,
      limit: row.valueLimit ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  protected toPersistence(entity: PlanEntitlementEntity): PlanEntitlementInsert {
    return {
      id: entity.id,
      environmentId: "", // Set by handler before save
      planId: entity.planId,
      entitlementId: entity.entitlementId,
      valueLimit: entity.limit ?? null,
    };
  }

  async findByPlanAndEntitlement(planId: string, entitlementId: string): Promise<PlanEntitlementEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(and(eq(planEntitlements.planId, planId), eq(planEntitlements.entitlementId, entitlementId)));

    const row = rows[0];
    return row ? this.toDomain(row as PlanEntitlementSelect) : null;
  }

  async find(filters: { planId?: string }): Promise<PlanEntitlementEntity[]> {
    const conditions = [];
    if (filters.planId) conditions.push(eq(planEntitlements.planId, filters.planId));

    const rows = conditions.length > 0
      ? await this.db.select().from(this.table).where(and(...conditions))
      : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as PlanEntitlementSelect));
  }
}
