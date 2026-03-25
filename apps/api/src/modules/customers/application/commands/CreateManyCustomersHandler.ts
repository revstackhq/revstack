import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateManyCustomersCommand } from "@/modules/customers/application/commands/CreateManyCustomersCommand";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export class CreateManyCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateManyCustomersCommand) {
    const customers = command.customers.map(dto => CustomerEntity.create(dto));
    
    if (this.repository.saveMany) {
      await this.repository.saveMany(customers);
    } else {
      // Fallback if saveMany is not yet properly surfaced in DB repo interface context
      for (const customer of customers) {
        await this.repository.save(customer);
      }
    }

    // Publish events
    for (const customer of customers) {
      await this.eventBus.publish({ eventName: "customer.created", id: customer.id, environmentId: customer.environmentId });
    }

    return customers.map(c => c.toPrimitives());
  }
}
