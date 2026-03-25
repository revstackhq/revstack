import { z } from "zod";

export const listAuditLogsSchema = z.object({
  environmentId: z.string().optional(),
  actorId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof listAuditLogsSchema>;
