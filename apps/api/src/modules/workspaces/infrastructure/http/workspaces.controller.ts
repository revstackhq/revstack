import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createMemberRoute,
  listMembersRoute,
  getMeRoute,
  getMemberRoute,
} from "@/modules/workspaces/infrastructure/http/workspaces.routes";
import { requireDashboardUser } from "@/common/middlewares/guards";

export const workspacesController = new OpenAPIHono<AppEnv>();

workspacesController.use("*", requireDashboardUser);

workspacesController.openapi(createMemberRoute, async (c) => {
  const handler = c.get("workspaces").create;
  const dto = c.req.valid("json");
  const environmentId = c.get("environmentId");
  const result = await handler.execute({
    ...dto,
    environment_id: environmentId,
  });
  return c.json(result, 201);
});

workspacesController.openapi(listMembersRoute, async (c) => {
  const handler = c.get("workspaces").list;
  const result = await handler.execute({});
  return c.json(result, 200);
});

workspacesController.openapi(getMemberRoute, async (c) => {
  const handler = c.get("workspaces").get;
  const dto = c.req.valid("param");
  const result = await handler.execute(dto);
  return c.json(result, 200);
});

workspacesController.openapi(getMeRoute, async (c) => {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const handler = c.get("workspaces").get;
  const result = await handler.execute({ id: userId });
  return c.json(result, 200);
});
