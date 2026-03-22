import type { ICustomerRepository } from "@/modules/customers/application/ports/ICustomerRepository";
import type { IEventBus } from "@/modules/customers/application/ports/IEventBus";
import type { ICacheService } from "@/modules/customers/application/ports/ICacheService";
import type { CreateCustomerCommand } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
import { CustomerCreatedEvent } from "@/modules/customers/domain/events/CustomerCreatedEvent";

export class CreateCustomerHandler {
  constructor(
    private readonly repository: ICustomerRepository,
    private readonly eventBus: IEventBus,
    private readonly cache: ICacheService
  ) {}

  public async handle(command: CreateCustomerCommand): Promise<string> {
    const existing = await this.repository.findByEmail(command.email);
    if (existing) {
      throw new Error("Customer with this email already exists");
    }

    const customer = CustomerEntity.create(command.email, command.name, command.providerId);

    await this.repository.save(customer);
    await this.cache.invalidate("customers_list");
    await this.eventBus.publish(new CustomerCreatedEvent(customer.id));

    return customer.id;
  }
}
