import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import {
  AddonNotFoundError,
  AddonRepository,
  EntitlementNotFoundError,
  EntitlementRepository,
} from "@revstackhq/core";

export const UpsertAddonEntitlementCommandSchema = z.object({
  addon_id: z.string().min(1),
  environment_id: z.string().min(1),
  entitlement_id: z.string().min(1),
  limit: z.number().int().optional().default(0),
  type: z.enum(["increment", "set"]).optional().default("increment"),
});

export type UpsertAddonEntitlementCommand = z.infer<
  typeof UpsertAddonEntitlementCommandSchema
>;

export const UpsertAddonEntitlementResponseSchema = z.object({
  success: z.boolean(),
});

export type UpsertAddonEntitlementResponse = z.infer<
  typeof UpsertAddonEntitlementResponseSchema
>;

export class UpsertAddonEntitlementHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly entitlementRepository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: UpsertAddonEntitlementCommand,
  ): Promise<UpsertAddonEntitlementResponse> {
    const addon = await this.repository.findById({
      id: command.addon_id,
      environmentId: command.environment_id,
    });

    if (!addon) {
      throw new AddonNotFoundError();
    }

    const entitlementEntity = await this.entitlementRepository.findById({
      id: command.entitlement_id,
      environmentId: command.environment_id,
    });

    if (!entitlementEntity) {
      throw new EntitlementNotFoundError(command.entitlement_id);
    }

    addon.addEntitlement(entitlementEntity, command.limit, command.type);

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    return { success: true };
  }
}
