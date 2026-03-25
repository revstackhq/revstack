import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { listAuditLogsSchema } from "@/modules/audit/application/queries/ListAuditLogsQuery";
import type { AppEnv } from "@/container";

export const auditController = new Hono<AppEnv>();

auditController.get("/", zValidator("query", listAuditLogsSchema), async (c) => {
  const handler = c.get("audit").listLogs;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

auditController.get("/:id", async (c) => {
  const handler = c.get("audit").getLog;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
