import type { ISubscriptionRepository } from "@/modules/subscriptions/application/ports/ISubscriptionRepository";
import type { IEventBus } from "@/modules/subscriptions/application/ports/IEventBus";
import type { ICacheService } from "@/modules/subscriptions/application/ports/ICacheService";
import type { CreateSubscriptionCommand } from "@/modules/subscriptions/application/commands/CreateSubscriptionCommand";
import { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";
import { SubscriptionCreatedEvent } from "@/modules/subscriptions/domain/events/SubscriptionCreatedEvent";

export class CreateSubscriptionHandler {
  constructor(
    private readonly repository: ISubscriptionRepository,
    private readonly eventBus: IEventBus,
    private readonly cache: ICacheService
  ) {}

  public async handle(command: CreateSubscriptionCommand): Promise<string> {
    const subscription = SubscriptionEntity.create(
      command.customerId,
      command.planId,
      command.priceId
    );

    await this.repository.save(subscription);
    
    // 2. Clear customer-specific cache
    await this.cache.invalidate(`subs_customer_${command.customerId}`);
    
    await this.eventBus.publish(new SubscriptionCreatedEvent(subscription.id));

    return subscription.id;
  }
}
