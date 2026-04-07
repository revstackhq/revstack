---
name: revstack-repository
description: Generates Repository interfaces (Ports) for Revstack aggregates. Use when defining database access contracts, ensuring tenant isolation, or abstracting data persistence.
---

# Revstack Repository Port Skill

This skill defines how to create Repository interfaces in the Core domain. These repositories act as Ports in the Hexagonal Architecture, ensuring the Domain remains ignorant of the underlying database (Postgres/Drizzle).

## When to use this skill

- When creating a repository interface for a new Entity.
- When adding new data access methods (find, save, delete) to an existing aggregate.

## How to use it

### 1. Parameter Objects

All repository methods MUST use an object for parameters. Do not use multiple primitive arguments. This ensures type safety and prevents argument swapping. All keys in the parameter object must be `camelCase`.

### 2. Strict Tenant Isolation

EVERY method (except for purely global administrative queries) MUST require `environmentId: string` inside the parameter object. This is Revstack's primary defense against IDOR vulnerabilities.

### 3. Return Types

Methods must strictly return:

- The Domain Entity (e.g., `Promise<CouponEntity>`).
- An array of Entities (e.g., `Promise<CouponEntity[]>`).
- Primitive types for mutations (e.g., `Promise<string>` for IDs, `Promise<boolean>` for deletes).
- Never return raw database records.

## Code Structure Example

```typescript
import type { CouponEntity } from "@/domain/aggregates/coupons/CouponEntity";

export interface CouponRepository {
  save(coupon: CouponEntity): Promise<string>;
  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<CouponEntity | null>;
  find(filters: {
    environmentId: string;
    status?: string;
  }): Promise<CouponEntity[]>;
  delete(params: { id: string; environmentId: string }): Promise<boolean>;
}
```
