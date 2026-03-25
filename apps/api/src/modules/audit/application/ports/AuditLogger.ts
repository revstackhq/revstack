export interface AuditLogger {
  log(payload: {
    environmentId: string;
    actorId: string;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, any>;
  }): Promise<void>;
}
