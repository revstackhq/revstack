import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createEnvironmentSchema } from "@/modules/environments/application/commands/CreateEnvironmentCommand";
import { updateEnvironmentSchema } from "@/modules/environments/application/commands/UpdateEnvironmentCommand";
import type { AppEnv } from "@/container";

export const environmentsController = new OpenAPIHono<AppEnv>();

const createEnvironmentRoute = createRoute({
  method: "post", path: "/", tags: ["Environments"],
  summary: "Create an environment",
  description: "Creates a new isolated environment (e.g. sandbox, production).",
  request: { body: { content: { "application/json": { schema: createEnvironmentSchema } } } },
  responses: { 201: { description: "Environment created", content: { "application/json": { schema: z.any() } } } },
});
environmentsController.openapi(createEnvironmentRoute, async (c) => {
  const handler = c.get("environments").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const getEnvironmentRoute = createRoute({
  method: "get", path: "/{id}", tags: ["Environments"],
  summary: "Get an environment",
  description: "Retrieves a specific environment by ID.",
  request: { params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }) },
  responses: { 200: { description: "Environment details", content: { "application/json": { schema: z.any() } } } },
});
environmentsController.openapi(getEnvironmentRoute, async (c) => {
  const handler = c.get("environments").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ environmentId: id });
  return c.json(result, 200);
});

const updateEnvironmentRoute = createRoute({
  method: "patch", path: "/{id}", tags: ["Environments"],
  summary: "Update an environment",
  description: "Updates the name of an existing environment.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }),
    body: { content: { "application/json": { schema: updateEnvironmentSchema } } },
  },
  responses: { 200: { description: "Environment updated", content: { "application/json": { schema: z.any() } } } },
});
environmentsController.openapi(updateEnvironmentRoute, async (c) => {
  const handler = c.get("environments").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ environmentId: id, ...dto });
  return c.json(result, 200);
});

const deleteEnvironmentRoute = createRoute({
  method: "delete", path: "/{id}", tags: ["Environments"],
  summary: "Delete an environment",
  description: "Permanently deletes an environment and all associated data.",
  request: { params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }) },
  responses: { 200: { description: "Environment deleted", content: { "application/json": { schema: z.object({ success: z.boolean(), message: z.string() }) } } } },
});
environmentsController.openapi(deleteEnvironmentRoute, async (c) => {
  const handler = c.get("environments").delete;
  const { id } = c.req.valid("param");
  await handler.handle({ environmentId: id });
  return c.json({ success: true, message: "Environment deleted successfully" }, 200);
});
