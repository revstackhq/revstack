import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createUserSchema } from "@/modules/users/application/use-cases/CreateUser/CreateUser.schema";
import { updateUserSchema } from "@/modules/users/application/use-cases/UpdateUser/UpdateUser.schema";
import { listUsersSchema } from "@/modules/users/application/use-cases/ListUsers/ListUsers.schema";
import type { AppEnv } from "@/container";

export const usersController = new OpenAPIHono<AppEnv>();

const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Users"],
  summary: "Create a user",
  description: "Creates a new end-user within an environment.",
  request: {
    body: { content: { "application/json": { schema: createUserSchema } } },
  },
  responses: {
    201: {
      description: "User created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

usersController.openapi(createUserRoute, async (c) => {
  const handler = c.get("users").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  summary: "List users",
  description:
    "Retrieves users with optional filtering by environment, role, and status.",
  request: { query: listUsersSchema },
  responses: {
    200: {
      description: "List of users",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

usersController.openapi(listUsersRoute, async (c) => {
  const handler = c.get("users").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Users"],
  summary: "Get a user",
  description: "Retrieves a single user by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "usr_abc123" }) }),
  },
  responses: {
    200: {
      description: "User details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

usersController.openapi(getUserRoute, async (c) => {
  const handler = c.get("users").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});

const updateUserRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Users"],
  summary: "Update a user",
  description: "Updates profile information for an existing user.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "usr_abc123" }) }),
    body: { content: { "application/json": { schema: updateUserSchema } } },
  },
  responses: {
    200: {
      description: "User updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

usersController.openapi(updateUserRoute, async (c) => {
  const handler = c.get("users").update;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ userId: id, ...dto });
  return c.json(result, 200);
});
