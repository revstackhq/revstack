---
name: revstack-postgres-repository
description: Generates PostgreSQL Repository adapters for Revstack using Drizzle ORM. Use when implementing Domain repository interfaces, handling database persistence, or writing complex SQL queries.
---

# Revstack Postgres Repository Skill

This skill defines how to create data access adapters in the Infrastructure layer. It ensures a strict mapping between database rows (Drizzle) and Domain Entities, while maintaining high performance through efficient SQL patterns.

## When to use this skill

- When implementing a `[Entity]Repository` interface defined in the Core.
- When adding persistence logic to a new module.
- When refactoring database access to support pagination or complex filters.

## How to use it

### 1. File Placement

Repository implementations go in: `apps/api/src/modules/[module]/infrastructure/adapters/Postgres[Entity]Repository.ts`.

### 2. Constructor & Dependencies

You **MUST** inject the database using the universal `DrizzleDB` type. Do **NOT** use `any`. Use Drizzle's inference types for internal mapping.

```typescript
import { coupons, DrizzleDB } from "@revstackhq/db";
import { CouponRepository } from "@revstackhq/core";

export class PostgresCouponRepository implements CouponRepository {
  constructor(private readonly db: DrizzleDB) {}
}
3. The "Undefined Barrier" (Mappers)Mappers are mandatory to separate DB concerns from Domain logic.toDomain(row): Convert database null to TypeScript undefined (e.g., field: row.field ?? undefined). Ensure metadata is cast as Record<string, unknown>.toPersistence(entity): Convert TypeScript undefined back to database null (e.g., field: entity.val.field ?? null).4. The save Method (Upsert Pattern)Every save operation MUST be an upsert to handle both creations and updates gracefully.Use .onConflictDoUpdate targeting the primary key.Manually map mutable fields in the set clause.TypeScriptasync save(entity: CouponEntity): Promise<string> {
  const data = this.toPersistence(entity);

  await this.db
    .insert(coupons)
    .values(data)
    .onConflictDoUpdate({
      target: coupons.id,
      set: {
        status: data.status,
        metadata: data.metadata,
        updatedAt: new Date()
      },
    });

  return entity.val.id;
}
5. Cursor Pagination (list method)When a list method is required, you MUST implement Keyset Pagination to ensure $O(1)$ performance at scale.Limit + 1 Technique: Fetch limit + 1 rows to determine if hasMore is true.Where Clause: Always filter by environmentId. If a cursor is provided, add a gt(table.id, cursor) condition.Order: Always order by the same column used for the cursor (usually id asc).6. Strict Security & ImmutabilityTenant Isolation: Every where clause MUST include eq(table.environmentId, params.environmentId).No Physical Deletes: Do NOT implement delete() methods for financial or structural entities (Coupons, Entitlements, Addons). Use the status field to "archive" them.7. Correct Formatting (Breathing Space)Maintain a blank line between logic blocks: condition building, query execution, and result mapping.TypeScriptasync list(params: { environmentId: string, limit?: number, cursor?: string }) {
  const take = params.limit ?? 50;
  const conditions = [eq(coupons.environmentId, params.environmentId)];

  if (params.cursor) {
    conditions.push(gt(coupons.id, params.cursor));
  }

  const rows = await this.db.query.coupons.findMany({
    where: and(...conditions),
    orderBy: (t, { asc }) => [asc(t.id)],
    limit: take + 1,
  });

  const hasMore = rows.length > take;

  // ... map and return
}
```
