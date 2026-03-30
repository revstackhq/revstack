import type { EntitlementRepository } from "@/modules/entitlements/application/ports/EntitlementRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { CreateEntitlementCommand } from "./CreateEntitlement.schema";
import { EntitlementEntity } from "@/modules/entitlements/domain/EntitlementEntity";
import { EntitlementCreatedEvent } from "@/modules/entitlements/domain/events/EntitlementEvents";

export class CreateEntitlementHandler {
  constructor(
    private readonly repository: EntitlementRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService,
  ) {}

  public async execute(command: CreateEntitlementCommand): Promise<string> {
    const entitlement = EntitlementEntity.create({
      environmentId: command.environment_id,
      slug: command.slug,
      name: command.name,
      description: command.description,
      type: command.type,
      unitType: command.unit_type,
      metadata: command.metadata,
    });

    await this.repository.save(entitlement);

    await this.cache.deletePrefix(`env:${command.environment_id}:entitlements`);

    await this.eventBus.publish(
      new EntitlementCreatedEvent({
        id: entitlement.val.id!,
        environmentId: entitlement.val.environmentId,
      }),
    );

    return entitlement.val.id!;
  }
}
