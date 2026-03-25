import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { CreateSubscriptionCommand } from "@/modules/subscriptions/application/commands/CreateSubscriptionCommand";
import { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";
import { SubscriptionCreatedEvent } from "@/modules/subscriptions/domain/events/SubscriptionCreatedEvent";

export class CreateSubscriptionHandler {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService
  ) {}

  public async handle(command: CreateSubscriptionCommand) {
    // 1. Verify plan exists
    // 2. Verify price belongs to plan
    
    const subscription = SubscriptionEntity.create(
      command.customerId,
      command.planId,
      command.priceId,
      command.couponId
    );

    await this.repository.save(subscription);
    
    // 2. Clear customer-specific cache
    await this.cache.invalidate(`subs_customer_${command.customerId}`);
    
    await this.eventBus.publish(new SubscriptionCreatedEvent(subscription.id));

    return subscription.id;
  }
}
