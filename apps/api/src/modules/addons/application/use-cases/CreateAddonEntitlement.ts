import { z } from "zod";
import type { AddonEntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntitlementEntity } from "@revstackhq/core";
import { ConflictError } from "@revstackhq/core";

// Input DTO
export const CreateAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1, "Addon ID is required"),
  entitlement_id: z.string().min(1, "Entitlement ID is required"),
  metadata: z.record(z.any()).optional(),
});

export type CreateAddonEntitlementCommand = z.infer<
  typeof CreateAddonEntitlementCommandSchema
>;

// Output DTO
export const CreateAddonEntitlementResponseSchema = z.object({
  id: z.string(),
  addon_id: z.string(),
  entitlement_id: z.string(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAddonEntitlementResponse = z.infer<
  typeof CreateAddonEntitlementResponseSchema
>;

export class CreateAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonEntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateAddonEntitlementCommand,
  ): Promise<CreateAddonEntitlementResponse> {
    const existing = await this.repository.findByAddonAndEntitlement(
      command.addon_id,
      command.entitlement_id,
    );

    if (existing) {
      throw new ConflictError(
        "Addon already has this entitlement",
        "ALREADY_EXISTS",
      );
    }

    const entity = AddonEntitlementEntity.create({
      addonId: command.addon_id,
      entitlementId: command.entitlement_id,
      metadata: command.metadata,
    });

    await this.repository.save(entity);
    await this.eventBus.publish(entity.pullEvents());

    const v = entity.val;
    return {
      id: v.id!,
      addon_id: v.addonId,
      entitlement_id: v.entitlementId,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
