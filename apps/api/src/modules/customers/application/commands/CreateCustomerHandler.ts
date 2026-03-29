import { CacheService } from "@/common/application/ports/CacheService";
import { EventBus } from "@/common/application/ports/EventBus";
import { CreateCustomerCommand } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
import { CustomerCreatedEvent } from "@/modules/customers/domain/events/CustomerEvents";

export class CreateCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService,
  ) {}

  public async handle(command: CreateCustomerCommand): Promise<string> {
    const existing = await this.repository.findByEmail(
      command.email,
      command.environmentId,
    );

    if (existing) {
      throw new Error("Customer with this email already exists");
    }

    const customer = CustomerEntity.create({
      environmentId: command.environmentId,
      userId: command.userId,
      providerId: command.providerId,
      externalId: command.externalId,
      email: command.email,
      name: command.name,
      phone: command.phone,
      metadata: command.metadata,
    });

    const customerId = await this.repository.save(customer);

    await this.cache.deletePrefix(`env:${command.environmentId}:customers:`);

    await this.eventBus.publish(
      new CustomerCreatedEvent({
        id: customerId,
        environmentId: customer.val.environmentId,
      }),
    );

    return customerId;
  }
}
