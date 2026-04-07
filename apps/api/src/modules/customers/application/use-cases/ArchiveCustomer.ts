import { z } from "zod";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CustomerRepository } from "@revstackhq/core";
import { CustomerNotFoundError } from "@revstackhq/core";

export const ArchiveCustomerCommandSchema = z.object({
  id: z.string().min(1),
  environment_id: z.string().min(1),
});

export type ArchiveCustomerCommand = z.infer<
  typeof ArchiveCustomerCommandSchema
>;

export const ArchiveCustomerResponseSchema = z.object({
  success: z.boolean(),
});

export type ArchiveCustomerResponse = z.infer<
  typeof ArchiveCustomerResponseSchema
>;

export class ArchiveCustomerHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: ArchiveCustomerCommand,
  ): Promise<ArchiveCustomerResponse> {
    const customer = await this.repository.findById({
      id: command.id,
      environmentId: command.environment_id,
    });

    if (!customer) {
      throw new CustomerNotFoundError(command.id);
    }

    customer.archive();

    await this.repository.save(customer);
    await this.eventBus.publish(customer.pullEvents());

    return {
      success: true,
    };
  }
}
