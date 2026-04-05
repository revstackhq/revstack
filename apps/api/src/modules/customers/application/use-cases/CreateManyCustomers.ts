import { z } from "zod";
import type { CustomerRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CustomerEntity } from "@revstackhq/core";

const customerPayloadSchema = z.object({
  user_id: z.string().min(1),
  provider_id: z.string().min(1),
  external_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const CreateManyCustomersCommandSchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  customers: z
    .array(customerPayloadSchema)
    .min(1, "At least one customer is required"),
});

export type CreateManyCustomersCommand = z.infer<
  typeof CreateManyCustomersCommandSchema
>;

export const CreateManyCustomersResponseSchema = z.array(z.any());

export type CreateManyCustomersResponse = z.infer<
  typeof CreateManyCustomersResponseSchema
>;

export class CreateManyCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateManyCustomersCommand,
  ): Promise<CreateManyCustomersResponse> {
    const customers = command.customers.map((payload) =>
      CustomerEntity.create({
        environmentId: command.environment_id,
        userId: payload.user_id,
        providerId: payload.provider_id,
        externalId: payload.external_id,
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        metadata: payload.metadata,
      }),
    );

    await this.repository.saveMany(customers);

    const allEvents = customers.flatMap((c) => c.pullEvents());
    if (allEvents.length > 0) {
      await this.eventBus.publish(allEvents);
    }

    return customers.map((c) => {
      const v = c.val;
      return {
        id: v.id!,
        environment_id: v.environmentId,
        user_id: v.userId,
        email: v.email,
        name: v.name,
        external_id: v.externalId,
        phone: v.phone ?? null,
        metadata: v.metadata ?? null,
        created_at: v.createdAt,
      };
    });
  }
}
