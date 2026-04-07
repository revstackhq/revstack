import { z } from "zod";
import type { EntitlementRepository } from "@revstackhq/core";
import { EntitlementNotFoundError } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";

export const UpdateEntitlementCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateEntitlementCommand = z.infer<
  typeof UpdateEntitlementCommandSchema
>;

export const UpdateEntitlementResponseSchema = z.object({
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

export type UpdateEntitlementResponse = z.infer<
  typeof UpdateEntitlementResponseSchema
>;

export class UpdateEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: UpdateEntitlementCommand,
  ): Promise<UpdateEntitlementResponse> {
    const entitlement = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!entitlement) {
      throw new EntitlementNotFoundError(command.id);
    }

    entitlement.update({
      name: command.name,
      description: command.description,
      status: command.status,
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
