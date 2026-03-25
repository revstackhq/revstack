import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { CouponRepository } from "@/modules/coupons/application/ports/CouponRepository";
import { CouponEntity } from "@/modules/coupons/domain/CouponEntity";
import { coupons } from "@revstackhq/db";

type CouponInsert = typeof coupons.$inferInsert;
type CouponSelect = typeof coupons.$inferSelect;

export class PostgresCouponRepo
  extends BasePostgresRepository<CouponEntity, CouponInsert, CouponSelect>
  implements CouponRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, coupons);
  }

  protected toDomain(row: CouponSelect): CouponEntity {
    return CouponEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      code: row.code,
      type: row.type,
      amount: row.value,
      isActive: row.status === "active",
      isArchived: row.status === "archived",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  protected toPersistence(entity: CouponEntity): CouponInsert {
    return {
      id: entity.id,
      environmentId: entity.environmentId,
      code: entity.code,
      name: entity.code,
      type: entity.type as any,
      value: entity.amount,
      duration: "forever" as any,
      status: entity.isArchived ? ("archived" as const) : entity.isActive ? ("active" as const) : ("inactive" as const),
    };
  }

  async findByCode(environmentId: string, code: string): Promise<CouponEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(and(eq(coupons.environmentId, environmentId), eq(coupons.code, code)));

    const row = rows[0];
    return row ? this.toDomain(row as CouponSelect) : null;
  }

  async find(filters: {
    environmentId?: string;
    isActive?: boolean;
    isArchived?: boolean;
  }): Promise<CouponEntity[]> {
    const conditions = [];
    if (filters.environmentId) conditions.push(eq(coupons.environmentId, filters.environmentId));
    if (filters.isArchived) conditions.push(eq(coupons.status, "archived"));
    else if (filters.isActive !== undefined) {
      conditions.push(eq(coupons.status, filters.isActive ? "active" : "inactive"));
    }

    const rows = conditions.length > 0
      ? await this.db.select().from(this.table).where(and(...conditions))
      : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as CouponSelect));
  }
}
