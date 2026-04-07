import { eq, and, gt, sql } from "drizzle-orm";
import { customers, type DrizzleDB } from "@revstackhq/db";
import {
  CustomerEntity,
  type CustomerRepository,
  type PaginatedCursorResult,
  CustomerStatus,
  CustomerTaxId,
  CustomerBillingAddress,
} from "@revstackhq/core";

export class PostgresCustomerRepository implements CustomerRepository {
  constructor(private readonly db: DrizzleDB) {}

  private toDomain(row: typeof customers.$inferSelect): CustomerEntity {
    return CustomerEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      userId: row.userId,
      providerId: row.providerId,
      externalId: row.externalId,
      email: row.email,
      name: row.name,
      currency: row.currency,
      phone: row.phone ?? undefined,
      status: row.status,
      billingAddress:
        (row.billingAddress as CustomerBillingAddress) ?? undefined,
      taxIds: (row.taxIds as CustomerTaxId[]) ?? [],
      metadata: (row.metadata as Record<string, unknown>) ?? {},
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPersistence(entity: CustomerEntity): typeof customers.$inferInsert {
    const v = entity.val;

    return {
      id: v.id,
      environmentId: v.environmentId,
      userId: v.userId,
      providerId: v.providerId,
      externalId: v.externalId,
      email: v.email,
      name: v.name,
      currency: v.currency,
      phone: v.phone ?? null,
      status: v.status,
      billingAddress: v.billingAddress ?? null,
      taxIds: v.taxIds ?? [],
      metadata: v.metadata ?? {},
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  }

  async save(customer: CustomerEntity): Promise<void> {
    const data = this.toPersistence(customer);

    await this.db
      .insert(customers)
      .values(data)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          currency: data.currency,
          status: data.status,
          billingAddress: data.billingAddress,
          taxIds: data.taxIds,
          metadata: data.metadata,
          updatedAt: new Date(),
        },
      });
  }

  async findById(params: {
    id: string;
    environmentId: string;
  }): Promise<CustomerEntity | null> {
    const row = await this.db.query.customers.findFirst({
      where: and(
        eq(customers.id, params.id),
        eq(customers.environmentId, params.environmentId),
      ),
    });

    return row ? this.toDomain(row) : null;
  }

  async findByExternalId(params: {
    externalId: string;
    environmentId: string;
  }): Promise<CustomerEntity | null> {
    const row = await this.db.query.customers.findFirst({
      where: and(
        eq(customers.externalId, params.externalId),
        eq(customers.environmentId, params.environmentId),
      ),
    });

    return row ? this.toDomain(row) : null;
  }

  async list(params: {
    environmentId: string;
    limit?: number;
    cursor?: string;
    status?: CustomerStatus;
  }): Promise<PaginatedCursorResult<CustomerEntity>> {
    const take = params.limit ?? 50;
    const conditions = [eq(customers.environmentId, params.environmentId)];

    if (params.cursor) {
      conditions.push(gt(customers.id, params.cursor));
    }

    if (params.status) {
      conditions.push(eq(customers.status, params.status));
    }

    const rows = await this.db.query.customers.findMany({
      where: and(...conditions),
      orderBy: (t, { asc }) => [asc(t.id)],
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

  async saveMany(entities: CustomerEntity[]): Promise<void> {
    if (entities.length === 0) return;

    const data = entities.map((e) => this.toPersistence(e));

    await this.db
      .insert(customers)
      .values(data)
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          name: sql`excluded.name`,
          email: sql`excluded.email`,
          phone: sql`excluded.phone`,
          currency: sql`excluded.currency`,
          status: sql`excluded.status`,
          billingAddress: sql`excluded.billing_address`,
          taxIds: sql`excluded.tax_ids`,
          metadata: sql`excluded.metadata`,
          updatedAt: new Date(),
        },
      });
  }
}
