import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { installIntegrationSchema } from "@/modules/integrations/application/commands/InstallIntegrationCommand";
import { updateIntegrationConfigSchema } from "@/modules/integrations/application/commands/UpdateIntegrationConfigCommand";
import { listIntegrationsSchema } from "@/modules/integrations/application/queries/ListIntegrationsQuery";
import type { AppEnv } from "@/container";

export const integrationsController = new Hono<AppEnv>();

integrationsController.post(
  "/",
  zValidator("json", installIntegrationSchema),
  async (c) => {
    const handler = c.get("integrations").install;
    const dto = c.req.valid("json");
    // Explicitly casting or extracting providerId based on schema
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

integrationsController.get(
  "/",
  zValidator("query", listIntegrationsSchema),
  async (c) => {
    const handler = c.get("integrations").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

integrationsController.get("/:id", async (c) => {
  const handler = c.get("integrations").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

integrationsController.patch(
  "/:id/config",
  zValidator("json", updateIntegrationConfigSchema),
  async (c) => {
    const handler = c.get("integrations").updateConfig;
    const dto = c.req.valid("json");
    const result = await handler.handle({ id: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);
