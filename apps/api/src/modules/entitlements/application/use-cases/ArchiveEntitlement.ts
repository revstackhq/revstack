import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { EntitlementRepository } from "@revstackhq/core";
import { EntitlementNotFoundError } from "@revstackhq/core";

export const ArchiveEntitlementCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});
export type ArchiveEntitlementCommand = z.infer<
  typeof ArchiveEntitlementCommandSchema
>;

export const ArchiveEntitlementResponseSchema = z.object({
  success: z.boolean(),
});
export type ArchiveEntitlementResponse = z.infer<
  typeof ArchiveEntitlementResponseSchema
>;

export class ArchiveEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: ArchiveEntitlementCommand,
  ): Promise<ArchiveEntitlementResponse> {
    const entitlement = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!entitlement) {
      throw new EntitlementNotFoundError(command.id);
    }

    entitlement.archive();

    await this.repository.save(entitlement);
    await this.eventBus.publish(entitlement.pullEvents());

    return {
      success: true,
    };
  }
}
