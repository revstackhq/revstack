---
name: revstack-factory
description: Generates Dependency Injection (DI) factories for Revstack modules. Use when refactoring the global container, cleaning up imports, or setting up the DI wiring for a new module.
---

# Revstack Module DI Factory Skill

This skill defines how to create a local Dependency Injection factory for a specific module. This pattern ensures the global `container.ts` remains lean, prevents circular dependencies, and maintains strict lazy loading for cold-start optimization.

## When to use this skill

- When requested to create a module factory.
- When refactoring the main container to delegate module-specific wiring.
- When adding new Use Cases to an existing module's DI structure.

## How to use it

### 1. File Placement

The factory MUST be placed in: `apps/api/src/modules/[module]/infrastructure/di/factory.ts`

### 2. Strict Import Rules (Path Aliases)

- **Core Entities/Ports:** Use `@revstackhq/core`.
- **Database/DB Types:** Use `@revstackhq/db`.
- **Local Application/Infra:** Use local path aliases `@/modules/[module]/...`.
- **Common Ports:** Use `@/common/application/ports/...`.
- **NEVER** use relative imports like `../../../../`.

### 3. Implementation Logic

- **Export Name:** Use the pattern `build[Module]Module` (e.g., `buildAddonsModule`).
- **Arguments:** Accept shared core dependencies: `(db: DrizzleDB, eventBus: EventBus, cache?: CacheService)`.
- **Shared Instances:** Instantiate the module's repositories **once** inside the function body so they are shared among the module's handlers.
- **Lazy Loading (GETTERS):** You MUST return an object where each Use Case is defined using a JavaScript `get` property. This ensures that a Handler is only instantiated when its specific route is called.

## Code Structure Example

```typescript
import type { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PostgresAddonRepository } from "@/modules/addons/infrastructure/adapters/PostgresAddonRepository";
import { CreateAddonHandler } from "@/modules/addons/application/use-cases/CreateAddon";
import { ListAddonsHandler } from "@/modules/addons/application/use-cases/ListAddons";

export function buildAddonsModule(db: DrizzleDB, eventBus: EventBus) {
  // Repositories are instantiated once per build
  const repository = new PostgresAddonRepository(db);

  return {
    // Handlers are instantiated ONLY when accessed (Lazy Loading)
    get create() {
      return new CreateAddonHandler(repository, eventBus);
    },
    get list() {
      return new ListAddonsHandler(repository);
    },
  };
}
```
