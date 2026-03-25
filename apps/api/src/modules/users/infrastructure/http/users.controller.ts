import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUserSchema } from "@/modules/users/application/commands/CreateUserCommand";
import { updateUserSchema } from "@/modules/users/application/commands/UpdateUserCommand";
import { listUsersSchema } from "@/modules/users/application/queries/ListUsersQuery";
import type { AppEnv } from "@/container";

export const usersController = new Hono<AppEnv>();

usersController.post(
  "/",
  zValidator("json", createUserSchema),
  async (c) => {
    const handler = c.get("users").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

usersController.get("/", zValidator("query", listUsersSchema), async (c) => {
  const handler = c.get("users").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

usersController.get("/:id", async (c) => {
  const handler = c.get("users").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});

usersController.patch(
  "/:id",
  zValidator("json", updateUserSchema),
  async (c) => {
    const handler = c.get("users").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ userId: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);
