import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import {
  AddonEntity,
  AddonRepository,
  EntitlementNotFoundError,
  EntitlementRepository,
} from "@revstackhq/core";

export const CreateAddonCommandSchema = z.object({
  environment_id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(["recurring", "one_time"]),
  billing_interval: z
    .enum(["day", "week", "month", "year"])
    .optional()
    .nullable(),
  billing_interval_count: z.number().int().positive().optional().nullable(),
  amount: z.number().int().min(0),
  currency: z.string().min(3).optional(),
  metadata: z.record(z.any()).optional(),
  entitlements: z
    .array(
      z.object({
        entitlement_id: z.string().min(1),
        limit: z.number().optional().default(0),
        type: z.enum(["increment", "set"]).optional().default("increment"),
      }),
    )
    .optional(),
});

export type CreateAddonCommand = z.infer<typeof CreateAddonCommandSchema>;

export const CreateAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  billing_interval: z.string().nullable(),
  billing_interval_count: z.number().nullable(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  metadata: z.record(z.any()),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAddonResponse = z.infer<typeof CreateAddonResponseSchema>;

export class CreateAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly entitlementRepository: EntitlementRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateAddonCommand,
  ): Promise<CreateAddonResponse> {
    const addon = AddonEntity.create({
      environmentId: command.environment_id,
      name: command.name,
      slug: command.slug,
      description: command.description ?? undefined,
      type: command.type,
      billingInterval: command.billing_interval ?? undefined,
      billingIntervalCount: command.billing_interval_count ?? undefined,
      amount: command.amount,
      currency: command.currency ?? "USD",
      metadata: command.metadata ?? {},
    });

    if (command.entitlements && command.entitlements.length > 0) {
      for (const ent of command.entitlements) {
        const entitlementEntity = await this.entitlementRepository.findById({
          id: ent.entitlement_id,
          environmentId: command.environment_id,
        });

        if (!entitlementEntity) {
          throw new EntitlementNotFoundError(ent.entitlement_id);
        }

        addon.addEntitlement(entitlementEntity, ent.limit, ent.type);
      }
    }

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    const v = addon.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      slug: v.slug,
      name: v.name,
      description: v.description ?? null,
      type: v.type,
      billing_interval: v.billingInterval ?? null,
      billing_interval_count: v.billingIntervalCount ?? null,
      amount: v.amount,
      currency: v.currency,
      status: v.status,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
