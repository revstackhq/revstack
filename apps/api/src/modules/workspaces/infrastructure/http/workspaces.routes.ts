import { createRoute, z } from "@hono/zod-openapi";
import { createWorkspaceMemberSchema } from "@/modules/workspaces/application/use-cases/CreateWorkspaceMember";

const TAG = ["Workspaces"];

export const getMeRoute = createRoute({
  method: "get",
  path: "/me",
  tags: TAG,
  summary: "Get current member profile",
  description:
    "Returns the profile of the currently authenticated workspace member based on their JWT.",
  responses: {
    200: {
      description: "Current member details",
      content: { "application/json": { schema: z.any() } },
    },
    401: { description: "Unauthorized" },
  },
});

export const createMemberRoute = createRoute({
  method: "post",
  path: "/",
  tags: TAG,
  summary: "Invite a workspace member",
  description: "Creates a new team member for the Revstack dashboard.",
  request: {
    body: {
      content: { "application/json": { schema: createWorkspaceMemberSchema } },
    },
  },
  responses: {
    201: {
      description: "Member invited",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const getMemberRoute = createRoute({
  method: "get",
  path: "/{handle}",
  tags: TAG,
  summary: "Get workspace member",
  description: "Returns the profile of a workspace member.",
  request: {
    params: z.object({
      id: z.string().optional(),
      email: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Workspace member details",
      content: { "application/json": { schema: z.any() } },
    },
    404: { description: "Workspace member not found" },
  },
});

export const listMembersRoute = createRoute({
  method: "get",
  path: "/",
  tags: TAG,
  summary: "List workspace members",
  responses: {
    200: {
      description: "List of members",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
