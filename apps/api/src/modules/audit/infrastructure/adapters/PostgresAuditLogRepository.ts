import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AuditLogRepository } from "@revstackhq/core";
import { AuditLogEntity } from "@revstackhq/core";
import { auditLogs } from "@revstackhq/db";

type AuditLogInsert = typeof auditLogs.$inferInsert;
type AuditLogSelect = typeof auditLogs.$inferSelect;

export class PostgresAuditLogRepository
  extends BasePostgresRepository<AuditLogEntity, AuditLogInsert, AuditLogSelect>
  implements AuditLogRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, auditLogs, {
      id: auditLogs.id,
      environmentId: auditLogs.environmentId,
    });
  }

  protected toDomain(row: AuditLogSelect): AuditLogEntity {
    return AuditLogEntity.restore({
      id: row.id,
      environment_id: row.environmentId,
      actor_id: row.actorId || "",
      action: row.action,
      resource: row.resource,
      metadata: (row.metadata as Record<string, any>) || {},
      created_at: row.createdAt,
    });
  }

  protected toPersistence(entity: AuditLogEntity): AuditLogInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environment_id,
      actorId: entity.val.actor_id,
      action: entity.val.action,
      resource: entity.val.resource,
      metadata: entity.val.metadata,
      createdAt: entity.val.created_at,
    };
  }

  async find(filters: {
    environmentId?: string;
    actorId?: string;
    action?: string;
    resource?: string;
  }): Promise<AuditLogEntity[]> {
    const conditions = [];
    if (filters.environmentId)
      conditions.push(eq(auditLogs.environmentId, filters.environmentId));
    if (filters.actorId)
      conditions.push(eq(auditLogs.actorId, filters.actorId));
    if (filters.action) conditions.push(eq(auditLogs.action, filters.action));
    if (filters.resource)
      conditions.push(eq(auditLogs.resource, filters.resource));

    const rows =
      conditions.length > 0
        ? await this.db
            .select()
            .from(this.table)
            .where(and(...conditions))
        : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as AuditLogSelect));
  }
}
