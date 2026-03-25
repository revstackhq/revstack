import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { installIntegrationSchema } from "@/modules/integrations/application/commands/InstallIntegrationCommand";
import { updateIntegrationConfigSchema } from "@/modules/integrations/application/commands/UpdateIntegrationConfigCommand";
import { listIntegrationsSchema } from "@/modules/integrations/application/queries/ListIntegrationsQuery";
import type { AppEnv } from "@/container";

export const integrationsController = new OpenAPIHono<AppEnv>();

const installIntegrationRoute = createRoute({
  method: "post", path: "/", tags: ["Integrations"],
  summary: "Install an integration",
  description: "Installs and configures a new payment provider integration (Stripe, Polar, etc.).",
  request: { body: { content: { "application/json": { schema: installIntegrationSchema } } } },
  responses: { 201: { description: "Integration installed", content: { "application/json": { schema: z.any() } } } },
});
integrationsController.openapi(installIntegrationRoute, async (c) => {
  const handler = c.get("integrations").install;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const listIntegrationsRoute = createRoute({
  method: "get", path: "/", tags: ["Integrations"],
  summary: "List integrations",
  description: "Retrieves all installed integrations for an environment.",
  request: { query: listIntegrationsSchema },
  responses: { 200: { description: "List of integrations", content: { "application/json": { schema: z.array(z.any()) } } } },
});
integrationsController.openapi(listIntegrationsRoute, async (c) => {
  const handler = c.get("integrations").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getIntegrationRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Integrations"],
  summary: "Get an integration",
  description: "Retrieves details of a specific integration.",
  request: { params: z.object({ id: z.string().openapi({ example: "int_abc123" }) }) },
  responses: { 200: { description: "Integration details", content: { "application/json": { schema: z.any() } } } },
});
integrationsController.openapi(getIntegrationRoute, async (c) => {
  const handler = c.get("integrations").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});

const updateIntegrationConfigRoute = createRoute({
  method: "patch", path: "/{id}/config", tags: ["Integrations"],
  summary: "Update integration config",
  description: "Updates the configuration of an installed integration.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "int_abc123" }) }),
    body: { content: { "application/json": { schema: updateIntegrationConfigSchema } } },
  },
  responses: { 200: { description: "Config updated", content: { "application/json": { schema: z.any() } } } },
});
integrationsController.openapi(updateIntegrationConfigRoute, async (c) => {
  const handler = c.get("integrations").updateConfig;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ id, ...dto });
  return c.json(result, 200);
});
