import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import { EntitlementEntity } from "@revstackhq/core";
import { EntitlementCreatedEvent } from "@revstackhq/core";

export const CreateEntitlementCommandSchema = z.object({
  environment_id: z.string(),
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["boolean", "metered", "static", "json"]),
  unit_type: z.enum([
    "count",
    "bytes",
    "seconds",
    "tokens",
    "requests",
    "custom",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateEntitlementCommand = z.infer<
  typeof CreateEntitlementCommandSchema
>;

export const EntitlementResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(["boolean", "metered", "static", "json"]),
  unit_type: z.enum([
    "count",
    "bytes",
    "seconds",
    "tokens",
    "requests",
    "custom",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.date(),
});

export class CreateEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService,
  ) {}

  public async execute(command: CreateEntitlementCommand): Promise<string> {
    const entitlement = EntitlementEntity.create({
      environmentId: command.environment_id,
      slug: command.slug,
      name: command.name,
      description: command.description,
      type: command.type,
      unitType: command.unit_type,
      metadata: command.metadata,
    });

    await this.repository.save(entitlement);

    await this.cache.deletePrefix(`env:${command.environment_id}:entitlements`);

    await this.eventBus.publish(
      new EntitlementCreatedEvent({
        id: entitlement.val.id!,
        environmentId: entitlement.val.environmentId,
      }),
    );

    return entitlement.val.id!;
  }
}
