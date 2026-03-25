import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { CreateCustomerCommand } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
import { CustomerCreatedEvent } from "@/modules/customers/domain/events/CustomerCreatedEvent";

export class CreateCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService
  ) {}

  public async handle(command: CreateCustomerCommand): Promise<string> {
    const existing = await this.repository.findByEmail(command.email);
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
    });

    await this.repository.save(customer);
    await this.cache.invalidate("customers_list");
    await this.eventBus.publish(new CustomerCreatedEvent(customer.id));

    return customer.id;
  }
}
