import type { IEntitlementRepository } from "@/modules/entitlements/application/ports/IEntitlementRepository";
import type { IEventBus } from "@/common/application/ports/IEventBus";
import type { ICacheService } from "@/common/application/ports/ICacheService";
import type { CreateEntitlementCommand } from "@/modules/entitlements/application/commands/CreateEntitlementCommand";
import { EntitlementEntity } from "@/modules/entitlements/domain/EntitlementEntity";
import { EntitlementCreatedEvent } from "@/modules/entitlements/domain/events/EntitlementCreatedEvent";

export class CreateEntitlementHandler {
  constructor(
    private readonly repository: IEntitlementRepository,
    private readonly eventBus: IEventBus,
    private readonly cache: ICacheService,
  ) {}

  public async handle(command: CreateEntitlementCommand): Promise<string> {
    // 1. Instantiate the Domain Entity
    const entitlement = EntitlementEntity.create(
      command.name,
      command.featureId,
      command.type,
      command.limit,
    );

    // 3. Persist to DB
    await this.repository.save(entitlement);

    // 2. Side Effect: Invalidate cache
    await this.cache.invalidate("entitlements_list");

    // 5. Side Effect: Publish domain event to the message queue
    await this.eventBus.publish(new EntitlementCreatedEvent(entitlement.id));

    return entitlement.id;
  }
}
