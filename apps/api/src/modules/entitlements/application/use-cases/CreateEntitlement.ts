import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";
import { EntitlementEntity } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";

export const CreateEntitlementCommandSchema = z.object({
  environment_id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["boolean", "metered", "static", "json"]),
  unit_type: z.enum([
    "count",
    "bytes",
    "seconds",
    "tokens",
    "requests",
    "custom",
  ]),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});
export type CreateEntitlementCommand = z.infer<
  typeof CreateEntitlementCommandSchema
>;

export const CreateEntitlementResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  unit_type: z.string(),
  status: z.string(),
  metadata: z.record(z.unknown()),
  created_at: z.date(),
  updated_at: z.date(),
});
export type CreateEntitlementResponse = z.infer<
  typeof CreateEntitlementResponseSchema
>;

export class CreateEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateEntitlementCommand,
  ): Promise<CreateEntitlementResponse> {
    const entitlement = EntitlementEntity.create({
      environmentId: command.environment_id,
      slug: command.slug,
      name: command.name,
      type: command.type,
      unitType: command.unit_type,
      description: command.description,
      metadata: command.metadata,
    });

    await this.repository.save(entitlement);
    await this.eventBus.publish(entitlement.pullEvents());

    const v = entitlement.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      slug: v.slug,
      name: v.name,
      description: v.description,
      type: v.type,
      unit_type: v.unitType,
      status: v.status,
      metadata: v.metadata ?? {},
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
