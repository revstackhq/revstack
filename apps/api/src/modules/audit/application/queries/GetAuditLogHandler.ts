import type { AuditLogRepository } from "@/modules/audit/application/ports/AuditLogRepository";
import type { GetAuditLogQuery } from "@/modules/audit/application/queries/GetAuditLogQuery";
import { AuditLogNotFoundError } from "@/modules/audit/domain/AuditErrors";

export class GetAuditLogHandler {
  constructor(private readonly repository: AuditLogRepository) {}

  public async handle(query: GetAuditLogQuery) {
    const log = await this.repository.findById(query.id);
    if (!log) {
      throw new AuditLogNotFoundError();
    }
    return log.toPrimitives();
  }
}
