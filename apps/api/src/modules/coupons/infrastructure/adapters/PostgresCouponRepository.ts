import { eq, and } from "drizzle-orm";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import { coupons, DrizzleDB } from "@revstackhq/db";
import { CouponEntity, CouponRepository } from "@revstackhq/core";

type CouponInsert = typeof coupons.$inferInsert;
type CouponSelect = typeof coupons.$inferSelect;

export class PostgresCouponRepository
  extends BasePostgresRepository<CouponEntity, CouponInsert, CouponSelect>
  implements CouponRepository
{
  constructor(db: DrizzleDB) {
    super(db, coupons, {
      id: coupons.id,
      environmentId: coupons.environmentId,
    });
  }

  protected toDomain(row: CouponSelect): CouponEntity {
    return CouponEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      code: row.code,
      type: row.type,
      duration: row.duration,
      durationInMonths: row.durationInMonths ?? undefined,
      maxRedemptions: row.maxRedemptions ?? undefined,
      expiresAt: row.expiresAt ?? undefined,
      metadata: row.metadata ?? undefined,
      amount: row.value,
      status: row.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  protected toPersistence(entity: CouponEntity): CouponInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environmentId,
      durationInMonths: entity.val.durationInMonths,
      expiresAt: entity.val.expiresAt,
      maxRedemptions: entity.val.maxRedemptions,
      code: entity.val.code,
      name: entity.val.code,
      type: entity.val.type,
      value: entity.val.amount,
      duration: entity.val.duration,
      metadata: entity.val.metadata,
      status: entity.val.status,
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
    status?: "active" | "inactive" | "archived";
  }): Promise<CouponEntity[]> {
    const conditions = [];
    if (filters.environmentId)
      conditions.push(eq(coupons.environmentId, filters.environmentId));
    if (filters.status) conditions.push(eq(coupons.status, filters.status));

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
