import { z } from "zod";

export const GetAuditLogQuerySchema = z.object({
  id: z.string(),
});

export type GetAuditLogQuery = z.infer<typeof GetAuditLogQuerySchema>;
