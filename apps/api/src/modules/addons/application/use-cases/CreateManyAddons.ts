import { CreateAddonCommandSchema } from "@/modules/addons/application/use-cases/CreateAddon";
import { z } from "zod";
import type { AddonRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntity } from "@revstackhq/core";

export const CreateManyAddonsCommandSchema = z.object({
  environment_id: z.string().min(1),
  addons: z
    .array(CreateAddonCommandSchema.omit({ environment_id: true }))
    .min(1),
});

export type CreateManyAddonsCommand = z.infer<
  typeof CreateManyAddonsCommandSchema
>;

export const CreateManyAddonsResponseSchema = z.array(z.any());

export type CreateManyAddonsResponse = z.infer<
  typeof CreateManyAddonsResponseSchema
>;

export class CreateManyAddonsHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateManyAddonsCommand,
  ): Promise<CreateManyAddonsResponse> {
    const addons = command.addons.map((dto) =>
      AddonEntity.create({
        environmentId: command.environment_id,
        amount: dto.amount,
        billingInterval: dto.billing_interval,
        billingIntervalCount: dto.billing_interval_count,
        currency: dto.currency,
        description: dto.description,
        name: dto.name,
        slug: dto.slug,
        type: dto.type,
        metadata: dto.metadata,
      }),
    );

    await this.repository.saveMany(addons);

    const allEvents = addons.flatMap((a) => a.pullEvents());
    if (allEvents.length > 0) {
      await this.eventBus.publish(allEvents);
    }

    return addons.map((a) => {
      const v = a.val;

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
    });
  }
}
