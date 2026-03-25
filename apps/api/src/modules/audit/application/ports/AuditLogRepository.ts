import type { AuditLogEntity } from "@/modules/audit/domain/AuditLogEntity";

export interface AuditLogRepository {
  findById(id: string): Promise<AuditLogEntity | null>;
  find(filters: {
    environmentId?: string;
    actorId?: string;
    action?: string;
    resource?: string;
  }): Promise<AuditLogEntity[]>;
}
