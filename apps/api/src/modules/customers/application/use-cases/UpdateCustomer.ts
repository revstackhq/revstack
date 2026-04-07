import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerNotFoundError } from "@revstackhq/core";
import { CustomerItemSchema } from "./CreateCustomer";

export const UpdateCustomerCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  billing_address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  tax_ids: z
    .array(
      z.object({
        type: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateCustomerCommand = z.infer<typeof UpdateCustomerCommandSchema>;

export const UpdateCustomerResponseSchema = CustomerItemSchema;

export type UpdateCustomerResponse = z.infer<
  typeof UpdateCustomerResponseSchema
>;

export class UpdateCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: UpdateCustomerCommand,
  ): Promise<UpdateCustomerResponse> {
    const customer = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!customer) {
      throw new CustomerNotFoundError(command.id);
    }

    customer.update({
      name: command.name,
      email: command.email,
      phone: command.phone,
      billingAddress: command.billing_address,
      taxIds: command.tax_ids,
      metadata: command.metadata,
    });

    await this.repository.save(customer);
    await this.eventBus.publish(customer.pullEvents());

    const v = customer.val;

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
  }
}
