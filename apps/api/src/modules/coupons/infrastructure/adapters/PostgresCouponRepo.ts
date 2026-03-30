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
    super(db, coupons, {
      id: coupons.id,
      environmentId: coupons.environmentId,
    });
  }

  protected toDomain(row: CouponSelect): CouponEntity {
    return CouponEntity.restore({
      id: row.id,
      environment_id: row.environmentId,
      code: row.code,
      type: row.type,
      amount: row.value,
      is_active: row.status === "active",
      is_archived: row.status === "archived",
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  protected toPersistence(entity: CouponEntity): CouponInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environment_id,
      code: entity.val.code,
      name: entity.val.code,
      type: entity.val.type as any,
      value: entity.val.amount,
      duration: "forever" as any,
      status: entity.val.is_archived
        ? ("archived" as const)
        : entity.val.is_active
          ? ("active" as const)
          : ("inactive" as const),
    };
  }

  async findByCode(
    environmentId: string,
    code: string,
  ): Promise<CouponEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(
        and(eq(coupons.environmentId, environmentId), eq(coupons.code, code)),
      );

    const row = rows[0];
    return row ? this.toDomain(row as CouponSelect) : null;
  }

  async find(filters: {
    environmentId?: string;
    isActive?: boolean;
    isArchived?: boolean;
  }): Promise<CouponEntity[]> {
    const conditions = [];
    if (filters.environmentId)
      conditions.push(eq(coupons.environmentId, filters.environmentId));
    if (filters.isArchived) conditions.push(eq(coupons.status, "archived"));
    else if (filters.isActive !== undefined) {
      conditions.push(
        eq(coupons.status, filters.isActive ? "active" : "inactive"),
      );
    }

    const rows =
      conditions.length > 0
        ? await this.db
            .select()
            .from(this.table)
            .where(and(...conditions))
        : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as CouponSelect));
  }
}
