import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { listAuditLogsSchema } from "@/modules/audit/application/queries/ListAuditLogsQuery";
import type { AppEnv } from "@/container";

export const auditController = new OpenAPIHono<AppEnv>();

const listAuditLogsRoute = createRoute({
  method: "get", path: "/", tags: ["Audit"],
  summary: "List audit logs",
  description: "Retrieves audit log entries with optional filtering by actor, action, and resource.",
  request: { query: listAuditLogsSchema },
  responses: { 200: { description: "List of audit logs", content: { "application/json": { schema: z.array(z.any()) } } } },
});
auditController.openapi(listAuditLogsRoute, async (c) => {
  const handler = c.get("audit").listLogs;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getAuditLogRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Audit"],
  summary: "Get an audit log entry",
  description: "Retrieves a single audit log entry by ID.",
  request: { params: z.object({ id: z.string().openapi({ example: "alog_abc123" }) }) },
  responses: { 200: { description: "Audit log details", content: { "application/json": { schema: z.any() } } } },
});
auditController.openapi(getAuditLogRoute, async (c) => {
  const handler = c.get("audit").getLog;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
