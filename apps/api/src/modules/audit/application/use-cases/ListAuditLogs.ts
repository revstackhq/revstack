import { z } from "zod";
import type { AuditLogRepository } from "@revstackhq/core";

export const ListAuditLogsQuerySchema = z.object({
  environment_id: z.string().optional(),
  actor_id: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof ListAuditLogsQuerySchema>;

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
