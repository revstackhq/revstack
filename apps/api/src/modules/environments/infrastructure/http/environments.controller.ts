import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createEnvironmentRoute,
  getEnvironmentRoute,
  updateEnvironmentRoute,
  deleteEnvironmentRoute,
} from "@/modules/environments/infrastructure/http/environments.routes";

export const environmentsController = new OpenAPIHono<AppEnv>();

environmentsController.openapi(createEnvironmentRoute, async (c) => {
  const handler = c.get("environments").create;

  const dto = c.req.valid("json");

  const result = await handler.execute(dto);

  return c.json(result, 201);
});

environmentsController.openapi(getEnvironmentRoute, async (c) => {
  const handler = c.get("environments").get;

  const { id } = c.req.valid("param");

  const result = await handler.execute({ id });

  return c.json(result, 200);
});

environmentsController.openapi(updateEnvironmentRoute, async (c) => {
  const handler = c.get("environments").update;

  const { id } = c.req.valid("param");

  const payload = c.req.valid("json");

  const result = await handler.execute({ id, name: payload.name });

  return c.json(result, 200);
});

environmentsController.openapi(deleteEnvironmentRoute, async (c) => {
  const handler = c.get("environments").delete;

  const { id } = c.req.valid("param");

  await handler.execute({ id });

  return c.json(
    { success: true, message: "Environment deleted successfully" },
    200,
  );
});
