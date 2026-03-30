import { z } from "zod";

export const ListAuditLogsQuerySchema = z.object({
  environment_id: z.string().optional(),
  actor_id: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof ListAuditLogsQuerySchema>;
