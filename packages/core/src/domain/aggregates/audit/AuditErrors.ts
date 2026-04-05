import { DomainError } from "@/domain/base/DomainError";

export class AuditLogNotFoundError extends DomainError {
  constructor() {
    super("Audit log not found", 404, "AUDIT_LOG_NOT_FOUND");
  }
}
