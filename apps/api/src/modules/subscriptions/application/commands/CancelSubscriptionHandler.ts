import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CancelSubscriptionCommand } from "@/modules/subscriptions/application/commands/CancelSubscriptionCommand";
import { NotFoundError } from "@/common/errors/DomainError";

export class CancelSubscriptionHandler {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CancelSubscriptionCommand) {
    const subscription = await this.repository.findById(command.id);
    if (!subscription) {
      throw new NotFoundError("Subscription not found", "SUBSCRIPTION_NOT_FOUND");
    }

    subscription.cancel();

    await this.repository.save(subscription);
    await this.eventBus.publish({ eventName: "subscription.canceled", id: subscription.id, customerId: subscription.customerId });

    return { success: true };
  }
}
