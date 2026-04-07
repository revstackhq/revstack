import { eq, and, gt } from "drizzle-orm";
import { addons, addonEntitlements, DrizzleDB } from "@revstackhq/db";
import {
  AddonBillingInterval,
  AddonEntitlementType,
  AddonEntity,
  AddonRepository,
  AddonStatus,
  AddonType,
  PaginatedCursorResult,
} from "@revstackhq/core";

type AddonInsert = typeof addons.$inferInsert;
type AddonSelect = typeof addons.$inferSelect;
type AddonWithEntitlements = AddonSelect & {
  entitlements?: (typeof addonEntitlements.$inferSelect)[];
};

export class PostgresAddonRepository implements AddonRepository {
  constructor(private readonly db: DrizzleDB) {}

  private toDomain(row: AddonWithEntitlements): AddonEntity {
    return AddonEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      slug: row.slug,
      name: row.name,
      description: row.description ?? undefined,
      type: row.type as AddonType,
      billingInterval:
        (row.billingInterval as AddonBillingInterval) ?? undefined,
      status: row.status as AddonStatus,
      billingIntervalCount: row.billingIntervalCount ?? undefined,
      amount: row.amount,
      currency: row.currency,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
      entitlements:
        row.entitlements?.map((e) => ({
          id: e.id,
          entitlementId: e.entitlementId,
          valueLimit: e.valueLimit ?? undefined,
          type: e.type as AddonEntitlementType,
        })) ?? [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(entity: AddonEntity): AddonInsert {
    const val = entity.val;
    return {
      id: val.id,
      environmentId: val.environmentId,
      slug: val.slug,
      name: val.name,
      description: val.description,
      type: val.type,
      billingInterval: val.billingInterval,
      billingIntervalCount: val.billingIntervalCount,
      amount: val.amount,
      currency: val.currency,
      status: val.status,
      metadata: val.metadata,
      createdAt: val.createdAt,
      updatedAt: val.updatedAt,
    };
  }

  async save(addon: AddonEntity): Promise<void> {
    const val = addon.val;
    const addonData = this.toPersistence(addon);

    await this.db.transaction(async (tx) => {
      await tx
        .insert(addons)
        .values(addonData)
        .onConflictDoUpdate({
          target: addons.id,
          set: {
            name: addonData.name,
            description: addonData.description,
            status: addonData.status,
            metadata: addonData.metadata,
            updatedAt: new Date(),
          },
        });

      await tx
        .delete(addonEntitlements)
        .where(eq(addonEntitlements.addonId, val.id));

      if (val.entitlements.length > 0) {
        const entitlementsData = val.entitlements.map((e) => ({
          addonId: val.id,
          entitlementId: e.entitlementId,
          valueLimit: e.valueLimit,
          type: e.type,
        }));

        await tx.insert(addonEntitlements).values(entitlementsData);
      }
    });
  }

  async findById(params: {
    id: string;
    environmentId: string;
  }): Promise<AddonEntity | null> {
    const row = await this.db.query.addons.findFirst({
      where: and(
        eq(addons.id, params.id),
        eq(addons.environmentId, params.environmentId),
      ),
      with: {
        entitlements: true,
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(params: {
    slug: string;
    environmentId: string;
  }): Promise<AddonEntity | null> {
    const row = await this.db.query.addons.findFirst({
      where: and(
        eq(addons.slug, params.slug),
        eq(addons.environmentId, params.environmentId),
      ),
      with: {
        entitlements: true,
      },
    });
    return row ? this.toDomain(row) : null;
  }

  async list(params: {
    environmentId: string;
    cursor?: string;
    limit?: number;
    status?: AddonStatus;
  }): Promise<PaginatedCursorResult<AddonEntity>> {
    const take = params.limit ?? 50;
    const conditions = [eq(addons.environmentId, params.environmentId)];

    if (params.status) {
      conditions.push(eq(addons.status, params.status));
    }

    if (params.cursor) {
      conditions.push(gt(addons.id, params.cursor));
    }

    const rows = await this.db.query.addons.findMany({
      where: and(...conditions),
      orderBy: (addons, { asc }) => [asc(addons.id)],
      limit: take + 1,
      with: {
        entitlements: true,
      },
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
