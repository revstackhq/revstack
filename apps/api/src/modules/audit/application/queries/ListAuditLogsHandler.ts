import type { AuditLogRepository } from "@/modules/audit/application/ports/AuditLogRepository";
import type { ListAuditLogsQuery } from "@/modules/audit/application/queries/ListAuditLogsQuery";

export class ListAuditLogsHandler {
  constructor(private readonly repository: AuditLogRepository) {}

  public async handle(query: ListAuditLogsQuery) {
    const logs = await this.repository.find(query);
    return logs.map(l => l.toPrimitives());
  }
}
