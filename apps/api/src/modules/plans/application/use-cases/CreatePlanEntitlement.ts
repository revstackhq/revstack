import { z } from "zod";
import type { PlanEntitlementRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PlanEntitlementEntity } from "@revstackhq/core";
import { DomainError } from "@revstackhq/core";
import { PlanEntitlementCreatedEvent } from "@revstackhq/core";

export const createPlanEntitlementSchema = z.object({
  entitlement_id: z.string().min(1),
  limit: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreatePlanEntitlementCommand = {
  plan_id: string;
} & z.infer<typeof createPlanEntitlementSchema>;

export const CreatePlanEntitlementResponseSchema = z.object({
  id: z.string().min(1),
  plan_id: z.string().min(1),
  entitlement_id: z.string().min(1),
  limit: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreatePlanEntitlementResponse = z.infer<
  typeof CreatePlanEntitlementResponseSchema
>;

export class CreatePlanEntitlementHandler {
  constructor(
    private readonly repository: PlanEntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreatePlanEntitlementCommand,
  ): Promise<CreatePlanEntitlementResponse> {
    const existing = await this.repository.findOne({
      planId: command.plan_id,
      entitlementId: command.entitlement_id,
    });

    if (existing) {
      throw new DomainError(
        "Plan already has this entitlement",
        409,
        "ALREADY_EXISTS",
      );
    }

    const planEntitlement = PlanEntitlementEntity.create({
      planId: command.plan_id,
      entitlementId: command.entitlement_id,
      limit: command.limit,
      metadata: command.metadata,
    });

    await this.repository.save(planEntitlement);

    await this.eventBus.publish(
      new PlanEntitlementCreatedEvent({
        id: planEntitlement.val.id!,
        planId: planEntitlement.val.planId,
        entitlementId: planEntitlement.val.entitlementId,
        limit: planEntitlement.val.limit!,
        metadata: planEntitlement.val.metadata!,
      }),
    );

    return {
      id: planEntitlement.val.id!,
      plan_id: planEntitlement.val.planId,
      entitlement_id: planEntitlement.val.entitlementId,
      limit: planEntitlement.val.limit,
      metadata: planEntitlement.val.metadata,
    };
  }
}
