import { eq, and } from "drizzle-orm";
import { entitlements, DrizzleDB } from "@revstackhq/db";
import {
  EntitlementEntity,
  EntitlementRepository,
  EntitlementType,
  EntitlementUnitType,
  EntitlementStatus,
} from "@revstackhq/core";

type EntitlementInsert = typeof entitlements.$inferInsert;
type EntitlementSelect = typeof entitlements.$inferSelect;

export class PostgresEntitlementRepository implements EntitlementRepository {
  constructor(private readonly db: DrizzleDB) {}

  private toDomain(row: EntitlementSelect): EntitlementEntity {
    return EntitlementEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      slug: row.slug,
      name: row.name,
      description: row.description ?? undefined,
      type: row.type as EntitlementType,
      unitType: row.unitType as EntitlementUnitType,
      status: row.status as EntitlementStatus,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(entity: EntitlementEntity): EntitlementInsert {
    const val = entity.val;
    return {
      id: val.id,
      environmentId: val.environmentId,
      slug: val.slug,
      name: val.name,
      description: val.description ?? null,
      type: val.type,
      unitType: val.unitType,
      status: val.status,
      metadata: val.metadata ?? null,
      createdAt: val.createdAt,
      updatedAt: val.updatedAt,
    };
  }

  async save(entitlement: EntitlementEntity): Promise<void> {
    const data = this.toPersistence(entitlement);

    await this.db
      .insert(entitlements)
      .values(data)
      .onConflictDoUpdate({
        target: entitlements.id,
        set: {
          name: data.name,
          description: data.description,
          status: data.status,
          metadata: data.metadata,
          updatedAt: new Date(),
        },
      });
  }

  async findById(params: {
    id: string;
    environmentId: string;
  }): Promise<EntitlementEntity | null> {
    const row = await this.db.query.entitlements.findFirst({
      where: and(
        eq(entitlements.id, params.id),
        eq(entitlements.environmentId, params.environmentId),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async findBySlug(params: {
    slug: string;
    environmentId: string;
  }): Promise<EntitlementEntity | null> {
    const row = await this.db.query.entitlements.findFirst({
      where: and(
        eq(entitlements.slug, params.slug),
        eq(entitlements.environmentId, params.environmentId),
      ),
    });
    return row ? this.toDomain(row) : null;
  }

  async findMany(params: {
    environmentId: string;
  }): Promise<EntitlementEntity[]> {
    const rows = await this.db.query.entitlements.findMany({
      where: (entitlements, { eq }) =>
        eq(entitlements.environmentId, params.environmentId),
      orderBy: (fields, { asc }) => [asc(fields.createdAt)],
    });

    return rows.map((row) => this.toDomain(row));
  }
}
