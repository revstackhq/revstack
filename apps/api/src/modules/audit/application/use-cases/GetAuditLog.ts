import { z } from "zod";
import type { AuditLogRepository } from "@revstackhq/core";
import { AuditLogNotFoundError } from "@revstackhq/core";

export const GetAuditLogQuerySchema = z.object({
  id: z.string(),
});

export type GetAuditLogQuery = z.infer<typeof GetAuditLogQuerySchema>;

export class GetAuditLogHandler {
  constructor(private readonly repository: AuditLogRepository) {}

  public async execute(query: GetAuditLogQuery) {
    const log = await this.repository.findById(query.id);
    if (!log) {
      throw new AuditLogNotFoundError();
    }
    return log.val;
  }
}
