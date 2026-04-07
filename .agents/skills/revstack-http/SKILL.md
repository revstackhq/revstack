---
name: revstack-http
description: Generates Hono OpenAPI routes and controllers for Revstack. Use when exposing Use Cases to the web, creating REST endpoints, or documenting APIs with Swagger/Zod.
---

# Revstack HTTP OpenAPI Skill

This skill defines how to create API endpoints using `@hono/zod-openapi`. It ensures strict separation between route definitions and controller logic, while reusing Zod schemas from the Application (Use Case) layer.

## When to use this skill

- When asked to create endpoints, routes, or controllers.
- When exposing a newly created Use Case to the HTTP layer.

## How to use it

### 1. File Placement

- Route definitions go in: `apps/api/src/modules/[module]/infrastructure/http/[entity].routes.ts`
- Controller implementations go in: `apps/api/src/modules/[module]/infrastructure/http/[entity].controller.ts`

### 2. Route Definitions (The Contract)

- Use `createRoute` from `@hono/zod-openapi`.
- **CRITICAL:** You MUST import the `CommandSchema`, `QuerySchema`, and `ResponseSchema` from the respective Use Case files and plug them directly into the route's `request.body`, `request.query`, and `responses` fields. Do NOT redefine Zod schemas in the routes file if they already exist in the Use Case.
- For URL parameters, define inline schemas using `.openapi({ example: "..." })`.

### 3. Controller Implementation (The Logic)

- Export a controller using `new OpenAPIHono<AppEnv>()`.
- Use `.openapi()` passing the route definition.
- Resolve the Use Case from the DI container using `c.get("useCaseName")`.

### 4. Controller Formatting (Breathing Space)

Controllers must be easily readable. You MUST leave a blank line between parameter/body extraction, use case execution, and the final return statement.

- For POST/PUT/PATCH requests, extract the body using `const body = c.req.valid("json");`.

**Correct Formatting Example:**

```typescript
import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import { createAddonEntitlementRoute } from "@/modules/addons/infrastructure/http/addons.routes"; // USE ABSOLUTE PATH ALIASES

export const addonsController = new OpenAPIHono<AppEnv>();

addonsController.openapi(createAddonEntitlementRoute, async (c) => {
  const { addonId, featureId } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await c
    .get("addonEntitlements")
    .create.execute({ ...body, addon_id: addonId, entitlement_id: featureId });

  return c.json(result, 200);
});
```

### 5. Authentication & Tenant Context (Strict Security)

The `environmentId` is securely managed by the `requireAuth` middleware. It MUST NEVER be requested from or trusted by the client via the HTTP body, query, or URL parameters.

- **In the Route Definition:** Do NOT expose `environment_id` in the `request.body` or `request.query` Zod schemas. If the Use Case schema includes it, use `.omit({ environment_id: true })` in the route definition.
- **In the Controller:** Extract the environment ID directly from the Hono context using `c.get("environmentId")`.
- **In the Execution:** Inject the extracted ID into the Use Case command/query manually.

**Example:**

```typescript
addonsController.openapi(createAddonRoute, async (c) => {
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId"); // Extracted from Auth

  const result = await c
    .get("addons")
    .create.execute({ ...body, environment_id: environmentId }); // Injected securely

  return c.json(result, 201);
});
```
