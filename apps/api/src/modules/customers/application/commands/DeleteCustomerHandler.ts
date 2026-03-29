import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteCustomerCommand } from "@/modules/customers/application/commands/DeleteCustomerCommand";
import { NotFoundError } from "@/common/errors/DomainError";
import { CustomerDeletedEvent } from "@/modules/customers/domain/events/CustomerEvents";

export class DeleteCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async handle(command: DeleteCustomerCommand) {
    const customer = await this.repository.findById(command.id);

    if (!customer) {
      throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
    }

    await this.repository.delete(command.id, command.environmentId);

    await this.eventBus.publish(
      new CustomerDeletedEvent({
        id: command.id,
        environmentId: customer.val.environmentId,
      }),
    );

    return { success: true };
  }
}
