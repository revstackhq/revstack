// --- Audit Events ---

export class AuditLogCreatedEvent {
  constructor(public readonly logId: string, public readonly occurredAt: Date = new Date()) {}
}
