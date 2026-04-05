import { createRoute, z } from "@hono/zod-openapi";
import { ListAuditLogsQuerySchema } from "@/modules/audit/application/use-cases/ListAuditLogs";

export const listAuditLogsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Audit"],
  summary: "List audit logs",
  description:
    "Retrieves audit log entries with optional filtering by actor, action, and resource.",
  request: { query: ListAuditLogsQuerySchema },
  responses: {
    200: {
      description: "List of audit logs",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const getAuditLogRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Audit"],
  summary: "Get an audit log entry",
  description: "Retrieves a single audit log entry by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "alog_abc123" }) }),
  },
  responses: {
    200: {
      description: "Audit log details",
      content: { "application/json": { schema: z.any() } },
    },
    404: {
      description: "Audit log not found",
    },
  },
});
