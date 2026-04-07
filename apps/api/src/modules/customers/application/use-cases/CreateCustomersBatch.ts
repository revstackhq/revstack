import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerEntity } from "@revstackhq/core";
import {
  CreateCustomerCommandSchema,
  CustomerItemSchema,
} from "./CreateCustomer";

export const CreateCustomersBatchCommandSchema = z.object({
  environment_id: z.string().min(1),
  customers: z
    .array(CreateCustomerCommandSchema.omit({ environment_id: true }))
    .min(1)
    .max(100),
});
export type CreateCustomersBatchCommand = z.infer<
  typeof CreateCustomersBatchCommandSchema
>;

export const CreateCustomersBatchResponseSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  customers: z.array(CustomerItemSchema),
});
export type CreateCustomersBatchResponse = z.infer<
  typeof CreateCustomersBatchResponseSchema
>;

export class CreateCustomersBatchHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateCustomersBatchCommand,
  ): Promise<CreateCustomersBatchResponse> {
    const environmentId = command.environment_id;

    const entities = command.customers.map((c) =>
      CustomerEntity.create({
        environmentId,
        userId: c.user_id,
        providerId: c.provider_id,
        externalId: c.external_id,
        email: c.email,
        name: c.name,
        phone: c.phone,
        currency: c.currency.toUpperCase(),
        billingAddress: c.billing_address ?? {},
        taxIds: c.tax_ids ?? [],
        metadata: c.metadata ?? {},
      }),
    );

    await this.repository.saveMany(entities);

    const allEvents = entities.flatMap((e) => e.pullEvents());
    await this.eventBus.publish(allEvents);

    return {
      success: true,
      count: entities.length,
      customers: entities.map((e) => {
        const v = e.val;
        return {
          id: v.id,
          environment_id: v.environmentId,
          user_id: v.userId,
          provider_id: v.providerId,
          external_id: v.externalId,
          email: v.email,
          name: v.name,
          phone: v.phone,
          currency: v.currency,
          billing_address: v.billingAddress,
          tax_ids: v.taxIds,
          status: v.status,
          metadata: v.metadata ?? {},
          created_at: v.createdAt,
          updated_at: v.updatedAt,
        };
      }),
    };
  }
}
