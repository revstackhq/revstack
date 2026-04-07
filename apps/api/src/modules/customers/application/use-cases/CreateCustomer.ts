import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerEntity } from "@revstackhq/core";

export const CreateCustomerCommandSchema = z.object({
  environment_id: z.string().min(1),
  user_id: z.string().min(1),
  provider_id: z.string().min(1),
  external_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  currency: z.string().min(3).max(3),
  billing_address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
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
export type CreateCustomerCommand = z.infer<typeof CreateCustomerCommandSchema>;

export const CustomerItemSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  user_id: z.string(),
  provider_id: z.string(),
  external_id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  currency: z.string(),
  billing_address: z.record(z.any()),
  tax_ids: z.array(z.any()),
  status: z.string(),
  metadata: z.record(z.unknown()),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CreateCustomerResponseSchema = CustomerItemSchema;
export type CreateCustomerResponse = z.infer<
  typeof CreateCustomerResponseSchema
>;

export class CreateCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateCustomerCommand,
  ): Promise<CreateCustomerResponse> {
    const customer = CustomerEntity.create({
      environmentId: command.environment_id,
      userId: command.user_id,
      providerId: command.provider_id,
      externalId: command.external_id,
      email: command.email,
      name: command.name,
      phone: command.phone,
      currency: command.currency.toLowerCase(),
      billingAddress: command.billing_address ?? {},
      taxIds: command.tax_ids ?? [],
      metadata: command.metadata ?? {},
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
