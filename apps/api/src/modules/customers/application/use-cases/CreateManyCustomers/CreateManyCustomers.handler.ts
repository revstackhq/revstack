import type { CustomerRepository } from "@/modules/customers/application/ports/CustomerRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";
import type {
  CreateManyCustomersCommand,
  CreateManyCustomersResponse,
} from "./CreateManyCustomers.schema";

export class CreateManyCustomersHandler {
  constructor(
    private readonly repository: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateManyCustomersCommand,
  ): Promise<CreateManyCustomersResponse> {
    const customers = command.customers.map((payload) =>
      CustomerEntity.create({
        environmentId: command.environment_id,
        userId: payload.user_id,
        providerId: payload.provider_id,
        externalId: payload.external_id,
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
        metadata: payload.metadata,
      }),
    );

    await this.repository.saveMany(customers);

    const allEvents = customers.flatMap((c) => c.pullEvents());
    if (allEvents.length > 0) {
      await this.eventBus.publish(allEvents);
    }

    return customers.map((c) => {
      const v = c.val;
      return {
        id: v.id!,
        environment_id: v.environmentId,
        user_id: v.userId,
        email: v.email,
        name: v.name,
        external_id: v.externalId,
        phone: v.phone ?? null,
        metadata: v.metadata ?? null,
        created_at: v.createdAt,
      };
    });
  }
}
