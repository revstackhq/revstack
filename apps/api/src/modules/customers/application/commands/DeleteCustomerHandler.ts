import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DeleteCustomerCommand } from "@/modules/customers/application/commands/DeleteCustomerCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class DeleteCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: DeleteCustomerCommand) {
    const customer = await this.repository.findById(command.id);
    if (!customer) {
      throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
    }

    if (this.repository.delete) {
      await this.repository.delete(command.id);
    } else {
      throw new Error("Delete method not implemented on repository");
    }

    await this.eventBus.publish({ eventName: "customer.deleted", id: customer.id, environmentId: customer.environmentId });
    return { success: true };
  }
}
