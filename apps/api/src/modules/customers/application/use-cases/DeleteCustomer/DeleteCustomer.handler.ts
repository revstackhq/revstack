import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@/common/errors/DomainError";
import { CustomerDeletedEvent } from "@/modules/customers/domain/events/CustomerEvents";
import type {
  DeleteCustomerCommand,
  DeleteCustomerResponse,
} from "./DeleteCustomer.schema";

export class DeleteCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: DeleteCustomerCommand,
  ): Promise<DeleteCustomerResponse> {
    const customer = await this.repository.findById(command.id);

    if (!customer) {
      throw new NotFoundError("Customer not found", "CUSTOMER_NOT_FOUND");
    }

    await this.repository.delete(command.id, command.environment_id);

    await this.eventBus.publish(
      new CustomerDeletedEvent({
        id: command.id,
        environmentId: customer.val.environmentId,
      }),
    );

    return { success: true };
  }
}
