import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateManyCustomersCommand } from "@/modules/customers/application/commands/CreateManyCustomersCommand";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export class CreateManyCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async handle(command: CreateManyCustomersCommand) {
    const customers = command.customers.map((customerPayload) =>
      CustomerEntity.create({
        ...customerPayload,
        environmentId: command.environmentId,
      }),
    );

    if (!this.repository.saveMany) {
      throw new Error("Method not implemented");
    }

    await this.repository.saveMany(customers);

    const allEvents = customers.flatMap((customer) => customer.pullEvents());

    if (allEvents.length > 0) {
      await this.eventBus.publish(allEvents);
    }

    return customers.map((c) => c.val);
  }
}
