import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createCustomerSchema } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { createManyCustomersSchema } from "@/modules/customers/application/commands/CreateManyCustomersCommand";
import type { AppEnv } from "@/container";

export const customersController = new OpenAPIHono<AppEnv>();

// --- POST / ---
const createCustomerRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Customers"],
  summary: "Create a customer",
  description: "Creates a new customer record linked to an environment.",
  request: {
    body: { content: { "application/json": { schema: createCustomerSchema } } },
  },
  responses: {
    201: {
      description: "Customer created successfully",
      content: { "application/json": { schema: z.object({ id: z.string(), success: z.boolean() }) } },
    },
    400: { description: "Validation error" },
  },
});

customersController.openapi(createCustomerRoute, async (c) => {
  const handler = c.get("customers").create;
  const dto = c.req.valid("json");
  const id = await handler.handle(dto);
  return c.json({ id, success: true }, 201);
});

// --- GET / ---
const listCustomersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Customers"],
  summary: "List customers",
  description: "Retrieves all customers for a given environment.",
  request: {
    query: z.object({ environmentId: z.string().openapi({ example: "env_abc123" }) }),
  },
  responses: {
    200: {
      description: "List of customers",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
    400: { description: "Missing environmentId" },
  },
});

customersController.openapi(listCustomersRoute, async (c) => {
  const handler = c.get("customers").list;
  const { environmentId } = c.req.valid("query");
  const result = await handler.handle({ environmentId });
  return c.json(result, 200);
});

// --- POST /bulk ---
const bulkCreateCustomersRoute = createRoute({
  method: "post",
  path: "/bulk",
  tags: ["Customers"],
  summary: "Bulk create customers",
  description: "Creates multiple customer records in a single request.",
  request: {
    body: { content: { "application/json": { schema: createManyCustomersSchema } } },
  },
  responses: {
    201: {
      description: "Customers created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

customersController.openapi(bulkCreateCustomersRoute, async (c) => {
  const handler = c.get("customers").createMany;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

// --- DELETE /:id ---
const deleteCustomerRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Delete a customer",
  description: "Permanently deletes a customer by their ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cust_abc123" }) }),
  },
  responses: {
    200: {
      description: "Customer deleted",
      content: { "application/json": { schema: z.object({ success: z.boolean(), message: z.string() }) } },
    },
  },
});

customersController.openapi(deleteCustomerRoute, async (c) => {
  const handler = c.get("customers").delete;
  const { id } = c.req.valid("param");
  await handler.handle({ id });
  return c.json({ success: true, message: "Customer deleted successfully" }, 200);
});
