Revstack API: Architecture Guide (Agent-Native)

The architecture of the @revstackhq/api project follows a Feature-Sliced Design (Vertical Architecture) pattern, heavily influenced by Domain-Driven Design (DDD), Hexagonal Architecture (Ports and Adapters), and CQRS (Command Query Responsibility Segregation).

Each business domain (e.g., customers, plans, invoices) operates independently, with self-contained layers. As an AI Agent, you must strictly respect these structural and naming conventions when generating or refactoring code.

📂 Base Directory Structure
Plaintext
src/
├── index.ts # Entry point. Configures Hono, OpenAPI, and mounts routes.
├── container.ts # DI Container. Instantiates repositories and orchestrates use cases.
├── common/ # Shared Kernel. Generic code (base events, base repositories, errors).
└── modules/ # Feature Slices. Independent business domains.

1. The common/ Directory (Shared Kernel)
   Contains the fundamental pieces that are agnostic to individual modules.

application/ports/: Base interfaces for cross-cutting services (e.g., EventBus.ts, CacheService.ts).

domain/: Abstract base classes such as Entity<T> and DomainEvent.

errors/: Common errors mapped to HTTP codes.

infrastructure/adapters/: Generic implementations. Highlights BasePostgresRepository.ts, which exposes CRUD behavior isolated by environmentId (multi-tenant).

middlewares/: Global Hono middlewares (e.g., API Key validation, environmentId injection).

2. The modules/ Directory (Feature Slices)
   Each folder within modules/ represents a business context (e.g., customers) and is divided into 3 fundamental layers.

A. Domain Layer (domain/)
The core of the hexagon. Contains pure logic. Importing HTTP frameworks or Database libraries here is strictly forbidden.

[Feature]Entity.ts: Rich models that maintain business invariants. Their methods mutate state and generate events (e.g., CustomerEntity.create()).

[Feature]Errors.ts: Native domain errors.

events/[Feature]Events.ts: Consolidated file with all domain events. They must extend DomainEvent.

Example of Events (CustomerEvents.ts):

TypeScript
import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface CustomerCreatedPayload {
id: string;
environmentId: string;
}

export class CustomerCreatedEvent extends DomainEvent<CustomerCreatedPayload> {
public readonly eventName = "customer.created";
constructor(payload: CustomerCreatedPayload) { super(payload); }
}
B. Application Layer (application/)
Defines use cases implementing CQRS. It is organized inside a use-cases/ folder.

ports/: Infrastructure contracts (e.g., CustomerRepository.ts).

use-cases/[Action]/: Dedicated folder for each operation (Command or Query). It must always contain two files: the Schema and the Handler.

Rules for Schemas ([Action].schema.ts):

They must define both the Input DTO (Command/Query) and the Output DTO (Response).

Zod schema properties must use snake_case.

TypeScript
// use-cases/CreateUser/CreateUser.schema.ts
import { z } from 'zod';

// 1. Input DTO (Command)
export const CreateUserCommandSchema = z.object({
email: z.string().email(),
password: z.string().min(8)
});
export type CreateUserCommand = z.infer<typeof CreateUserCommandSchema>;

// 2. Output DTO (Response)
export const CreateUserResponseSchema = z.object({
id: z.string().uuid(),
email: z.string().email(),
created_at: z.date()
});
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
Rules for Handlers ([Action].handler.ts):

The main method must be named execute.

The function contract must be strongly typed using the inferred types from the schema.

TypeScript
// use-cases/CreateUser/CreateUser.handler.ts
import type { Database } from '@/common/infrastructure/database';
import { CreateUserCommand, CreateUserResponse, CreateUserResponseSchema } from './CreateUser.schema';

export class CreateUserHandler {
constructor(private readonly db: Database) {}

async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
const user = await this.db.users.create(command);
return CreateUserResponseSchema.parse(user);
}
}
C. Infrastructure Layer (infrastructure/)
Implements the ports (DB connections) and Web adapters (Hono Routes).

adapters/Postgres[Feature]Repository.ts: Repository implementation using Drizzle. It must extend BasePostgresRepository.

http/: Web Controllers layer separated into 3 files by design:

1. [feature].routes.ts (OpenAPI Declaration):

TypeScript
import { createRoute, z } from "@hono/zod-openapi";
import { createCustomerSchema } from "@/modules/customers/application/use-cases/CreateCustomer/CreateCustomer.schema";

export const createCustomerRoute = createRoute({
method: "post",
path: "/",
tags: ["Customers"],
summary: "Create a customer",
request: {
body: { content: { "application/json": { schema: createCustomerSchema } } },
},
responses: {
201: { description: "Created", content: { "application/json": { schema: z.object({ id: z.string() }) } } },
},
}); 2. [feature].controller.ts (Endpoint Logic):

TypeScript
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiKeyMiddleware } from "@/common/middlewares/api-key";
import type { AppEnv } from "@/container";
import { createCustomerRoute } from "./customers.routes";
import { createCustomerSchema } from "@/modules/customers/application/use-cases/CreateCustomer/CreateCustomer.schema";

export const customersController = new OpenAPIHono<AppEnv>();

customersController.use("\*", apiKeyMiddleware);

customersController.openapi(createCustomerRoute, async (c) => {
const body = await c.req.json();
const environmentId = c.get("environmentId");

const command = createCustomerSchema.parse({ ...body, environmentId });
const result = await c.get("customers").create.execute(command); // Calls the Handler

return c.json({ id: result }, 201);
}); 3. index.ts (Router Exporter):

TypeScript
import { customersController } from "./customers.controller";
export const customersRoutes = customersController;
🔄 Request Lifecycle
Entry: The main index.ts receives the request and routes it to the [feature].controller.ts.

Web Layer: The middleware injects the environmentId. The controller extracts the body, validates it against the Input Schema ([Action].schema.ts), and passes it to the Handler.

Use Case (Application): The [Action].handler.ts executes its execute() method. It coordinates dependency loading.

Domain: Entity methods (CustomerEntity) are called to validate business rules and generate DomainEvents.

Persistence: The Handler injects the repository (Postgres[Feature]Repository.ts), which translates the request to SQL using Drizzle and saves it in the DB while respecting isolation.

Output & Effects: The Handler filters the data using the Output Schema (ResponseDTO), emits the stored events to the EventBus, and returns the result to the controller to send the HTTP Response.
