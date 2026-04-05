import { createRoute, z } from "@hono/zod-openapi";
import { createUserSchema } from "@/modules/users/application/use-cases/CreateUser";
import { updateUserSchema } from "@/modules/users/application/use-cases/UpdateUser";
import { listUsersSchema } from "@/modules/users/application/use-cases/ListUsers";

export const createUserRoute = createRoute({
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

export const listUsersRoute = createRoute({
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

export const getUserRoute = createRoute({
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

export const updateUserRoute = createRoute({
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
