---
name: revstack-entity
description: Generates pure Domain-Driven Design (DDD) Entities, events, and errors for Revstack. Use when creating or modifying core business logic, defining aggregates, or modeling domain constraints.
---

# Revstack Entity Generation Skill

This skill guides the creation of Domain Entities in the Revstack B2B SaaS architecture. Entities are the core of the business logic and must be completely decoupled from infrastructure (e.g., Drizzle, HTTP).

## When to use this skill

- When requested to create a new Domain Entity or Aggregate Root.
- When modeling business rules, domain events, or domain errors.
- When asked to map a database schema into a pure TypeScript domain model.

## How to use it

### 1. Strict camelCase (Domain Boundary)

Everything inside the Domain layer MUST be strictly `camelCase`. This includes class properties, interface definitions, method names, and method arguments. Even if the database uses `snake_case`, the entity must map it to `camelCase` internally.

### 2. Identify Properties

Always look into the Drizzle schema located in `packages/db` to determine the exact properties the entity needs.

### 3. Type Extraction (Enum rule)

Do NOT inline literal unions (enums) directly inside the main `Props` interface. Extract them to exported types above the interface so they can be imported and reused by Use Cases.

**Correct Example:**

```typescript
export type CouponDuration = "forever" | "once" | "repeating";
export type CouponType = "fixed" | "percent";

export interface CouponProps {
  id: string;
  environmentId: string;
  duration: CouponDuration;
  type: CouponType;
  // ... other props
}
4. Dedicated Method Props
Create separate, explicit types for the parameters of each mutation method using Omit, Pick, or Partial.

TypeScript
export type CreateCouponProps = Omit<CouponProps, "id" | "status" | "createdAt" | "updatedAt">;
export type UpdateCouponProps = Partial<Pick<CouponProps, "status" | "metadata" | "expiresAt">>;
5. Class Structure Constraints
Must extend Entity<[Entity]Props> from @/domain/base/Entity.

The constructor MUST be private.

Implement public static restore(props: [Entity]Props): [Entity]Entity for DB hydration.

Implement public static create(props: Create[Entity]Props): [Entity]Entity for new instances. Use generateId("[prefix]") inside.

6. Events and Errors
Group events in [Entity]Events.ts and errors in [Entity]Errors.ts inside the aggregate folder.

Dispatch events using this.addEvent(new [EventName]({ ... })) when state mutates.
```

### 7. Domain Events (Strict camelCase)

Domain Events originate within the pure Domain layer. Therefore, their payload interfaces MUST use strictly `camelCase` properties. NEVER use `snake_case` inside a Domain Event.
**Correct:** `export interface AddonCreatedPayload { id: string; environmentId: string; }`
**Incorrect:** `{ environment_id: string; }`
