import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import type { AuditLogRepository } from "@/modules/audit/application/ports/AuditLogRepository";
import { AuditLogEntity } from "@/modules/audit/domain/AuditLogEntity";
import { auditLogs } from "@revstackhq/db";

type AuditLogSelect = typeof auditLogs.$inferSelect;

export class PostgresAuditLogRepo implements AuditLogRepository {
  constructor(private readonly db: PgDatabase<any, any, any>) {}

  private toDomain(row: AuditLogSelect): AuditLogEntity {
    return AuditLogEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      actorId: row.actorId || "",
      action: row.action,
      resource: row.resource,
      metadata: (row.metadata as Record<string, any>) || {},
      createdAt: row.createdAt,
    });
  }

  async findById(id: string): Promise<AuditLogEntity | null> {
    const rows = await this.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id));

    const row = rows[0];
    return row ? this.toDomain(row) : null;
  }

  async find(filters: {
    environmentId?: string;
    actorId?: string;
    action?: string;
    resource?: string;
  }): Promise<AuditLogEntity[]> {
    const conditions = [];
    if (filters.environmentId) conditions.push(eq(auditLogs.environmentId, filters.environmentId));
    if (filters.actorId) conditions.push(eq(auditLogs.actorId, filters.actorId));
    if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
    if (filters.resource) conditions.push(eq(auditLogs.resource, filters.resource));

    const rows = conditions.length > 0
      ? await this.db.select().from(auditLogs).where(and(...conditions))
      : await this.db.select().from(auditLogs);

    return rows.map((row) => this.toDomain(row));
  }
}
