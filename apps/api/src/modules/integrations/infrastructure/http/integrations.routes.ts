import { createRoute, z } from "@hono/zod-openapi";
import { installIntegrationSchema } from "@/modules/integrations/application/use-cases/InstallIntegration";
import { updateIntegrationConfigSchema } from "@/modules/integrations/application/use-cases/UpdateIntegrationConfig";
import { listIntegrationsSchema } from "@/modules/integrations/application/use-cases/ListIntegrations";

export const installIntegrationRoute = createRoute({
  method: "post", path: "/", tags: ["Integrations"],
  summary: "Install an integration",
  description: "Installs and configures a new payment provider integration (Stripe, Polar, etc.).",
  request: { body: { content: { "application/json": { schema: installIntegrationSchema } } } },
  responses: { 201: { description: "Integration installed", content: { "application/json": { schema: z.any() } } } },
});

export const listIntegrationsRoute = createRoute({
  method: "get", path: "/", tags: ["Integrations"],
  summary: "List integrations",
  description: "Retrieves all installed integrations for an environment.",
  request: { query: listIntegrationsSchema },
  responses: { 200: { description: "List of integrations", content: { "application/json": { schema: z.array(z.any()) } } } },
});

export const getIntegrationRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Integrations"],
  summary: "Get an integration",
  description: "Retrieves details of a specific integration.",
  request: { params: z.object({ id: z.string().openapi({ example: "int_abc123" }) }) },
  responses: { 200: { description: "Integration details", content: { "application/json": { schema: z.any() } } } },
});

export const updateIntegrationConfigRoute = createRoute({
  method: "patch", path: "/{id}/config", tags: ["Integrations"],
  summary: "Update integration config",
  description: "Updates the configuration of an installed integration.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "int_abc123" }) }),
    body: { content: { "application/json": { schema: updateIntegrationConfigSchema } } },
  },
  responses: { 200: { description: "Config updated", content: { "application/json": { schema: z.any() } } } },
});
