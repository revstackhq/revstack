import { createRoute, z } from "@hono/zod-openapi";
import { CreateEnvironmentCommandSchema } from "@/modules/environments/application/use-cases/CreateEnvironment/CreateEnvironment.schema";
import { UpdateEnvironmentCommandSchema } from "@/modules/environments/application/use-cases/UpdateEnvironment/UpdateEnvironment.schema";

export const createEnvironmentRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Environments"],
  summary: "Create an environment",
  description: "Creates a new isolated environment (e.g. sandbox, production).",
  request: {
    body: { content: { "application/json": { schema: CreateEnvironmentCommandSchema } } },
  },
  responses: {
    201: { description: "Environment created", content: { "application/json": { schema: z.any() } } },
  },
});

export const getEnvironmentRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Environments"],
  summary: "Get an environment",
  description: "Retrieves a specific environment by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }),
  },
  responses: {
    200: { description: "Environment details", content: { "application/json": { schema: z.any() } } },
  },
});

export const updateEnvironmentRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Environments"],
  summary: "Update an environment",
  description: "Updates the name of an existing environment.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }),
    body: { content: { "application/json": { schema: UpdateEnvironmentCommandSchema } } },
  },
  responses: {
    200: { description: "Environment updated", content: { "application/json": { schema: z.any() } } },
  },
});

export const deleteEnvironmentRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Environments"],
  summary: "Delete an environment",
  description: "Permanently deletes an environment and all associated data.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "env_abc123" }) }),
  },
  responses: {
    200: {
      description: "Environment deleted",
      content: { "application/json": { schema: z.object({ success: z.boolean(), message: z.string() }) } },
    },
  },
});
