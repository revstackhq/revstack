import { CreateCustomerCommandSchema } from "@/modules/customers/application/use-cases/CreateCustomer";
import { CreateManyCustomersCommandSchema } from "@/modules/customers/application/use-cases/CreateManyCustomers";
import { DeleteCustomerCommandSchema } from "@/modules/customers/application/use-cases/DeleteCustomer";
import { CustomerResponseSchema, ListCustomersQuerySchema } from "@/modules/customers/application/use-cases/ListCustomers";
import { createRoute, z } from "@hono/zod-openapi";


export const createCustomerRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Customers"],
  summary: "Create a customer",
  request: {
    body: { content: { "application/json": { schema: CreateCustomerCommandSchema } } },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: z.object({ id: z.string() }) } },
    },
  },
});

export const listCustomersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Customers"],
  summary: "List customers",
  request: {
    query: ListCustomersQuerySchema,
  },
  responses: {
    200: {
      description: "Customer List",
      content: {
        "application/json": {
          schema: z.array(CustomerResponseSchema),
        },
      },
    },
  },
});

export const getCustomerRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Retrieve a customer",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Customer Found",
      content: { "application/json": { schema: z.any() } },
    },
    404: { description: "Not Found" },
  },
});

export const updateCustomerRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Update a customer",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            metadata: z.record(z.any()).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const bulkCreateRoute = createRoute({
  method: "post",
  path: "/bulk",
  tags: ["Customers"],
  summary: "Bulk create customers",
  request: {
    body: {
      content: {
        "application/json": { schema: CreateManyCustomersCommandSchema },
      },
    },
  },
  responses: {
    201: { description: "Bulk success" },
  },
});

export const deleteCustomerRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Delete a customer",
  request: {
    params: DeleteCustomerCommandSchema,
  },
  responses: {
    200: { description: "Deleted" },
  },
});
