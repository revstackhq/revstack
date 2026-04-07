import { eq, and, gt } from "drizzle-orm";
import { coupons, DrizzleDB } from "@revstackhq/db";
import {
  CouponEntity,
  CouponRepository,
  CouponStatus,
  PaginatedCursorResult,
} from "@revstackhq/core";

export class PostgresCouponRepository implements CouponRepository {
  constructor(private readonly db: DrizzleDB) {}

  private toDomain(row: typeof coupons.$inferSelect): CouponEntity {
    return CouponEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      code: row.code,
      type: row.type,
      duration: row.duration,
      durationInMonths: row.durationInMonths ?? undefined,
      maxRedemptions: row.maxRedemptions ?? undefined,
      currency: row.currency ?? undefined,
      redemptionsCount: row.redemptionsCount,
      restrictedPlanIds: row.restrictedPlanIds ?? [],
      isFirstTimeOnly: row.isFirstTimeOnly,
      expiresAt: row.expiresAt ?? undefined,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
      amount: row.value,
      status: row.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private toPersistence(entity: CouponEntity): typeof coupons.$inferInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environmentId,
      durationInMonths: entity.val.durationInMonths ?? null,
      expiresAt: entity.val.expiresAt ?? null,
      maxRedemptions: entity.val.maxRedemptions ?? null,
      currency: entity.val.currency ?? null,
      redemptionsCount: entity.val.redemptionsCount,
      restrictedPlanIds: entity.val.restrictedPlanIds,
      isFirstTimeOnly: entity.val.isFirstTimeOnly,
      code: entity.val.code,
      name: entity.val.code,
      type: entity.val.type,
      value: entity.val.amount,
      duration: entity.val.duration,
      metadata: entity.val.metadata ?? {},
      status: entity.val.status,
    };
  }

  async save(coupon: CouponEntity): Promise<string> {
    const data = this.toPersistence(coupon);

    await this.db
      .insert(coupons)
      .values(data)
      .onConflictDoUpdate({
        target: coupons.id,
        set: {
          durationInMonths: data.durationInMonths,
          expiresAt: data.expiresAt,
          maxRedemptions: data.maxRedemptions,
          currency: data.currency,
          redemptionsCount: data.redemptionsCount,
          restrictedPlanIds: data.restrictedPlanIds,
          isFirstTimeOnly: data.isFirstTimeOnly,
          type: data.type,
          value: data.value,
          duration: data.duration,
          metadata: data.metadata,
          status: data.status,
        },
      });

    return coupon.val.id;
  }

  async findById(params: {
    id: string;
    environmentId: string;
  }): Promise<CouponEntity | null> {
    const row = await this.db.query.coupons.findFirst({
      where: and(
        eq(coupons.id, params.id),
        eq(coupons.environmentId, params.environmentId),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByCode(params: {
    environmentId: string;
    code: string;
  }): Promise<CouponEntity | null> {
    const row = await this.db.query.coupons.findFirst({
      where: and(
        eq(coupons.environmentId, params.environmentId),
        eq(coupons.code, params.code),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async list(params: {
    environmentId: string;
    status?: CouponStatus;
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<CouponEntity>> {
    const take = params.limit ?? 50;
    const conditions = [eq(coupons.environmentId, params.environmentId)];

    if (params.status) {
      conditions.push(eq(coupons.status, params.status));
    }

    if (params.cursor) {
      conditions.push(gt(coupons.id, params.cursor));
    }

    const rows = await this.db.query.coupons.findMany({
      where: and(...conditions),
      orderBy: (coupons, { asc }) => [asc(coupons.id)],
      limit: take + 1,
    });

    const hasMore = rows.length > take;
    const items = hasMore ? rows.slice(0, -1) : rows;
    const nextCursor = hasMore ? (items.at(-1)?.id ?? null) : null;

    return {
      data: items.map((row) => this.toDomain(row)),
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  }
}
