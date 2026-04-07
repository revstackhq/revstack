import { createRoute, z } from "@hono/zod-openapi";
import {
  CreateCustomerCommandSchema,
  CreateCustomerResponseSchema,
} from "@/modules/customers/application/use-cases/CreateCustomer";
import {
  CreateCustomersBatchCommandSchema,
  CreateCustomersBatchResponseSchema,
} from "@/modules/customers/application/use-cases/CreateCustomersBatch";
import {
  UpdateCustomerCommandSchema,
  UpdateCustomerResponseSchema,
} from "@/modules/customers/application/use-cases/UpdateCustomer";
import { ArchiveCustomerResponseSchema } from "@/modules/customers/application/use-cases/ArchiveCustomer";
import { GetCustomerResponseSchema } from "@/modules/customers/application/use-cases/GetCustomer";
import {
  ListCustomersQuerySchema,
  ListCustomersResponseSchema,
} from "@/modules/customers/application/use-cases/ListCustomers";

export const createCustomerRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Customers"],
  summary: "Create a new customer",
  description: "Creates a new customer linked to a user.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCustomerCommandSchema.omit({ environment_id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Customer created",
      content: { "application/json": { schema: CreateCustomerResponseSchema } },
    },
  },
});

export const createCustomersBatchRoute = createRoute({
  method: "post",
  path: "/batch",
  tags: ["Customers"],
  summary: "Create multiple customers",
  description: "Creates a batch of new customers efficiently.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCustomersBatchCommandSchema.omit({
            environment_id: true,
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Customers created",
      content: {
        "application/json": { schema: CreateCustomersBatchResponseSchema },
      },
    },
  },
});

export const updateCustomerRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Update a customer",
  description: "Updates an existing customer's details.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cus_abc123" }) }),
    body: {
      content: {
        "application/json": {
          schema: UpdateCustomerCommandSchema.omit({
            environment_id: true,
            id: true,
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Customer updated",
      content: { "application/json": { schema: UpdateCustomerResponseSchema } },
    },
  },
});

export const archiveCustomerRoute = createRoute({
  method: "post",
  path: "/{id}/archive",
  tags: ["Customers"],
  summary: "Archive a customer",
  description: "Archives a customer, preventing future usage.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cus_abc123" }) }),
  },
  responses: {
    200: {
      description: "Customer archived",
      content: {
        "application/json": { schema: ArchiveCustomerResponseSchema },
      },
    },
  },
});

export const getCustomerRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Customers"],
  summary: "Get a customer",
  description: "Retrieves a customer by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cus_abc123" }) }),
  },
  responses: {
    200: {
      description: "Customer retrieved",
      content: { "application/json": { schema: GetCustomerResponseSchema } },
    },
  },
});

export const listCustomersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Customers"],
  summary: "List customers",
  description: "Retrieves a paginated list of customers.",
  request: {
    query: ListCustomersQuerySchema.omit({ environment_id: true }),
  },
  responses: {
    200: {
      description: "Customers retrieved",
      content: { "application/json": { schema: ListCustomersResponseSchema } },
    },
  },
});
