import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createUserRoute,
  listUsersRoute,
  getUserRoute,
  updateUserRoute,
} from "@/modules/users/infrastructure/http/users.routes";

export const usersController = new OpenAPIHono<AppEnv>();


usersController.openapi(createUserRoute, async (c) => {
  const handler = c.get("users").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

usersController.openapi(listUsersRoute, async (c) => {
  const handler = c.get("users").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

usersController.openapi(getUserRoute, async (c) => {
  const handler = c.get("users").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

usersController.openapi(updateUserRoute, async (c) => {
  const handler = c.get("users").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ userId: id, ...dto });
  return c.json(result, 200);
});
