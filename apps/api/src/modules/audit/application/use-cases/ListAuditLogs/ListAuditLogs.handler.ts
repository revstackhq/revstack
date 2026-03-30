import type { AuditLogRepository } from "@/modules/audit/application/ports/AuditLogRepository";
import type { ListAuditLogsQuery } from "./ListAuditLogs.schema";

export class ListAuditLogsHandler {
  constructor(private readonly repository: AuditLogRepository) {}

  public async execute(query: ListAuditLogsQuery) {
    const logs = await this.repository.find({
      environmentId: query.environment_id,
      actorId: query.actor_id,
      action: query.action,
      resource: query.resource,
    });
    return logs.map((l) => l.val);
  }
}
