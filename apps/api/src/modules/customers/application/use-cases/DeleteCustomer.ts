import { z } from "zod";
import type { CustomerRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";
import { CustomerDeletedEvent } from "@revstackhq/core";

export const DeleteCustomerCommandSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  environment_id: z.string().min(1, "Environment ID is required"),
});

export type DeleteCustomerCommand = z.infer<typeof DeleteCustomerCommandSchema>;

export const DeleteCustomerResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteCustomerResponse = z.infer<typeof DeleteCustomerResponseSchema>;

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
