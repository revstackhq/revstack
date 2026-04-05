import { addonTypeEnum, billingIntervalEnum, statusEnum } from "@revstackhq/db";
import { z } from "zod";
import type { AddonRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntity } from "@revstackhq/core";

export const CreateAddonCommandSchema = z.object({
  environment_id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(addonTypeEnum.enumValues),
  amount: z.number().min(0),
  currency: z.string().min(1),
  description: z.string().optional(),
  billing_interval: z.enum(billingIntervalEnum.enumValues).optional(),
  billing_interval_count: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateAddonCommand = z.infer<typeof CreateAddonCommandSchema>;

export const CreateAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.enum(addonTypeEnum.enumValues),
  status: z.enum(statusEnum.enumValues),
  billing_interval: z.enum(billingIntervalEnum.enumValues).optional(),
  billing_interval_count: z.number().optional(),
  amount: z.number(),
  currency: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAddonResponse = z.infer<typeof CreateAddonResponseSchema>;

export class CreateAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateAddonCommand,
  ): Promise<CreateAddonResponse> {
    const addon = AddonEntity.create({
      environmentId: command.environment_id,
      amount: command.amount,
      billingInterval: command.billing_interval,
      billingIntervalCount: command.billing_interval_count,
      currency: command.currency,
      description: command.description,
      name: command.name,
      slug: command.slug,
      type: command.type,
      metadata: command.metadata,
    });

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    const v = addon.val;

    return {
      id: v.id,
      environment_id: v.environmentId,
      name: v.name,
      type: v.type,
      status: v.status,
      billing_interval: v.billingInterval,
      billing_interval_count: v.billingIntervalCount,
      amount: v.amount,
      currency: v.currency,
      description: v.description,
      metadata: v.metadata,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
