import type { CacheService } from "@/common/application/ports/CacheService";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
import { CustomerCreatedEvent } from "@/modules/customers/domain/events/CustomerEvents";
import { ConflictError } from "@/common/errors/DomainError";
import type {
  CreateCustomerCommand,
  CreateCustomerResponse,
} from "./CreateCustomer.schema";

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
