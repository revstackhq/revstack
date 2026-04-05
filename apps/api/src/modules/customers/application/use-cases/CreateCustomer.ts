import { z } from "zod";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerEntity } from "@revstackhq/core";
import { CustomerCreatedEvent } from "@revstackhq/core";
import { ConflictError } from "@revstackhq/core";

export const CreateCustomerCommandSchema = z.object({
  environment_id: z.string().min(1),
  user_id: z.string().min(1),
  provider_id: z.string().min(1),
  external_id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateCustomerCommand = z.infer<typeof CreateCustomerCommandSchema>;

export const CreateCustomerResponseSchema = z.object({
  id: z.string(),
});

export type CreateCustomerResponse = z.infer<typeof CreateCustomerResponseSchema>;

export class CreateCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService,
  ) {}

  public async execute(
    command: CreateCustomerCommand,
  ): Promise<CreateCustomerResponse> {
    const existing = await this.repository.findByEmail(
      command.email,
      command.environment_id,
    );

    if (existing) {
      throw new ConflictError(
        "Customer with this email already exists",
        "CUSTOMER_EXISTS",
      );
    }

    const customer = CustomerEntity.create({
      environmentId: command.environment_id,
      userId: command.user_id,
      providerId: command.provider_id,
      externalId: command.external_id,
      email: command.email,
      name: command.name,
      phone: command.phone,
      metadata: command.metadata,
    });

    const customerId = await this.repository.save(customer);

    await this.cache.deletePrefix(`env:${command.environment_id}:customers:`);

    await this.eventBus.publish(
      new CustomerCreatedEvent({
        id: customerId,
        environmentId: customer.val.environmentId,
      }),
    );

    return { id: customerId };
  }
}
