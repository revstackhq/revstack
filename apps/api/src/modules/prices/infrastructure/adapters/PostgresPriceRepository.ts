import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { PriceRepository } from "@revstackhq/core";
import { PriceEntity } from "@revstackhq/core";
import { prices } from "@revstackhq/db";

type PriceInsert = typeof prices.$inferInsert;
type PriceSelect = typeof prices.$inferSelect;

export class PostgresPriceRepository
  extends BasePostgresRepository<PriceEntity, PriceInsert, PriceSelect>
  implements PriceRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, prices);
  }

  protected toDomain(row: PriceSelect): PriceEntity {
    return PriceEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      name: row.unitLabel || "",
      amount: row.amount,
      currency: row.currency,
      interval: row.billingInterval,
      type: row.type,
      planId: row.planId,
      addonId: undefined,
      isArchived: row.status === "archived",
      version: 1,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
    });
  }

  protected toPersistence(entity: PriceEntity): PriceInsert {
    return {
      id: entity.id,
      environmentId: entity.environmentId,
      planId: entity.planId || "",
      type: entity.type as any,
      amount: entity.amount,
      currency: entity.currency,
      billingInterval: (entity.interval || "month") as any,
      billingScheme: "flat" as any,
      unitLabel: entity.name,
      metadata: entity.metadata,
      status: entity.isArchived ? ("archived" as const) : ("active" as const),
    };
  }

  async find(filters: {
    environmentId?: string;
    planId?: string;
    addonId?: string;
    isArchived?: boolean;
  }): Promise<PriceEntity[]> {
    const conditions = [];
    if (filters.environmentId) conditions.push(eq(prices.environmentId, filters.environmentId));
    if (filters.planId) conditions.push(eq(prices.planId, filters.planId));
    if (filters.isArchived !== undefined) {
      conditions.push(eq(prices.status, filters.isArchived ? "archived" : "active"));
    }

    const rows = conditions.length > 0
      ? await this.db.select().from(this.table).where(and(...conditions))
      : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as PriceSelect));
  }
}
