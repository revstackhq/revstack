import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  listAuditLogsRoute,
  getAuditLogRoute,
} from "@/modules/audit/infrastructure/http/audit.routes";
import { AuditLogNotFoundError } from "@revstackhq/core";

export const auditController = new OpenAPIHono<AppEnv>();

auditController.openapi(listAuditLogsRoute, async (c) => {
  const query = c.req.valid("query");
  const result = await c.get("audit").listLogs.execute(query);
  return c.json(result, 200);
});

auditController.openapi(getAuditLogRoute, async (c) => {
  const { id } = c.req.valid("param");
  try {
    const result = await c.get("audit").getLog.execute({ id });
    return c.json(result, 200);
  } catch (err: any) {
    if (err instanceof AuditLogNotFoundError) {
      return c.json({ error: "Audit log not found" }, 404);
    }
    throw err;
  }
});
