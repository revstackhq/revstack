import { eq, and, gt } from "drizzle-orm";
import { addons, DrizzleDB } from "@revstackhq/db";
import {
  AddonEntity,
  AddonRepository,
  PaginatedCursorResult,
  PlanStatus,
  PricingType,
} from "@revstackhq/core";

type AddonInsert = typeof addons.$inferInsert;
type AddonSelect = typeof addons.$inferSelect;

export class PostgresAddonRepository implements AddonRepository {
  constructor(
    private readonly db: DrizzleDB,
    private readonly environmentId?: string,
  ) {}

  private toDomain(row: AddonSelect): AddonEntity {
    return AddonEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      slug: row.slug,
      name: row.name,
      description: row.description ?? undefined,
      type: row.type,
      billingInterval: row.billingInterval ?? undefined,
      billingIntervalCount: row.billingIntervalCount ?? undefined,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      metadata: row.metadata ?? {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(entity: AddonEntity): AddonInsert {
    const val = entity.val;
    return {
      id: val.id,
      environmentId: this.environmentId!,
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
    const data = this.toPersistence(addon);

    await this.db
      .insert(addons)
      .values(data)
      .onConflictDoUpdate({
        target: addons.id,
        set: {
          name: data.name,
          description: data.description,
          status: data.status,
          metadata: data.metadata,
          updatedAt: new Date(),
        },
      });
  }

  async saveMany(entities: AddonEntity[]): Promise<void> {
    if (entities.length === 0) return;
    for (const entity of entities) {
      await this.save(entity);
    }
  }

  async findById(id: string): Promise<AddonEntity | null> {
    const row = await this.db.query.addons.findFirst({
      where: and(
        eq(addons.id, id),
        eq(addons.environmentId, this.environmentId),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<AddonEntity | null> {
    const row = await this.db.query.addons.findFirst({
      where: and(
        eq(addons.slug, slug),
        eq(addons.environmentId, this.environmentId),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(params: {
    status?: PlanStatus;
    type?: PricingType;
    limit: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<AddonEntity>> {
    const conditions = [eq(addons.environmentId, this.environmentId)];

    if (params.status !== undefined) {
      conditions.push(eq(addons.status, params.status));
    }

    if (params.type) {
      conditions.push(eq(addons.type, params.type));
    }

    if (params.cursor) {
      conditions.push(gt(addons.id, params.cursor));
    }

    const rows = await this.db.query.addons.findMany({
      where: and(...conditions),
      orderBy: (addons, { asc }) => [asc(addons.id)],
      limit: params.limit + 1,
    });

    const hasMore = rows.length > params.limit;
    const items = hasMore ? rows.slice(0, -1) : rows;
    const nextCursor = hasMore ? (items.at(-1)?.id ?? null) : null;

    return {
      items: items.map((row) => this.toDomain(row)),
      nextCursor,
      hasMore,
    };
  }
}
