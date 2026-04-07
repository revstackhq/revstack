---
name: revstack-usecase
description: Generates Single-File Use Cases for Revstack. Handles Zod validation, snake_case to camelCase mapping, and orchestrates entities and repositories.
---

# Revstack Single-File Use Case Skill

This skill dictates the creation of application use cases using the "Single-File Use Case" pattern. It enforces the boundary between external `snake_case` payloads and internal `camelCase` domain logic.

## When to use this skill

- When creating a new feature or endpoint logic.
- When orchestrating interactions between Repositories, Entities, and the EventBus.

## How to use it

### 1. File Placement

Place the `.ts` file directly in the `apps/api/src/modules/[module]/application/use-cases/` directory. Do NOT create subfolders for individual use cases.

### 2. The Snake Case Boundary (CRITICAL RULE)

The Application layer is the boundary. All external JSON data is `snake_case`. All internal Domain logic is `camelCase`.

- **Input Zod Schemas** (`CommandSchema` / `QuerySchema`) MUST use `snake_case` keys.
- **Output Zod Schemas** (`ResponseSchema`) MUST use `snake_case` keys.
- You MUST explicitly map between these two casings inside the `execute` method.

### 3. Required File Structure

Every Use Case file MUST contain:

1. `[Action]CommandSchema` (Zod, `snake_case`)
2. `[Action]Command` type (Inferred)
3. `[Action]ResponseSchema` (Zod, `snake_case`)
4. `[Action]Response` type (Inferred)
5. `[Action]Handler` class with `execute` method.

### 4. Handler Execution Flow & Explicit Mapping

The `execute` method must follow this sequence:

1. **Conflict Check:** Validate using the Repository.
2. **Inbound Mapping:** Map the incoming `snake_case` command properties to the `camelCase` props required by the Domain Entity.
3. **Domain Action:** Instantiate via `Entity.create(...)` or call mutation methods.
4. **Persistence:** Call `this.repository.save(entity)`.
5. **Events:** Publish events via `await this.eventBus.publish(entity.pullEvents())`.
6. **Outbound Mapping:** Return a plain object that explicitly maps the `camelCase` entity properties (`entity.val.*`) back to the `snake_case` keys defined in the `ResponseSchema`.

## Code Structure Example

```typescript
import { z } from "zod";
import type { CouponRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CouponEntity, DomainError } from "@revstackhq/core";

export const CreateCouponCommandSchema = z.object({
  environment_id: z.string().min(1),
  duration_in_months: z.number().optional(),
  // ... other snake_case fields
});
export type CreateCouponCommand = z.infer<typeof CreateCouponCommandSchema>;

export const CreateCouponResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  duration_in_months: z.number().optional(),
  created_at: z.date(),
  // ... other snake_case fields
});
export type CreateCouponResponse = z.infer<typeof CreateCouponResponseSchema>;

export class CreateCouponHandler {
  constructor(
    private readonly repository: CouponRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateCouponCommand,
  ): Promise<CreateCouponResponse> {
    // 1. Inbound Mapping (snake to camel)
    const coupon = CouponEntity.create({
      environmentId: command.environment_id,
      durationInMonths: command.duration_in_months,
      // ...
    });

    await this.repository.save(coupon);
    await this.eventBus.publish(coupon.pullEvents());

    // 2. Outbound Mapping (camel to snake)
    const v = coupon.val;
    return {
      id: v.id,
      environment_id: v.environmentId,
      duration_in_months: v.durationInMonths,
      created_at: v.createdAt,
      // ...
    };
  }
}
```

### 3. Required File Structure & Naming Conventions

Every Use Case file MUST contain the Zod Schema and its inferred type immediately below it.

- For mutations (POST/PUT/PATCH/DELETE): Use `[Action]CommandSchema` and `[Action]Command`.
- For reads (GET): Use `[Action]QuerySchema` and `[Action]Query`.
- For responses: Use `[Action]ResponseSchema` and `[Action]Response`.

**Example:**

```typescript
export const RemoveAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1),
  environment_id: z.string().min(1),
});
export type RemoveAddonEntitlementCommand = z.infer<
  typeof RemoveAddonEntitlementCommandSchema
>;
```
