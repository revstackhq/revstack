import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateSubscriptionCommand } from "./UpdateSubscription.schema";
import { NotFoundError } from "@/common/errors/DomainError";

export class UpdateSubscriptionHandler {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateSubscriptionCommand) {
    const subscription = await this.repository.findById(command.id);
    if (!subscription) {
      throw new NotFoundError("Subscription not found", "SUBSCRIPTION_NOT_FOUND");
    }

    subscription.update({
      planId: command.planId,
      priceId: command.priceId,
      couponId: command.couponId,
      isAutoRenew: command.isAutoRenew,
    });

    await this.repository.save(subscription);
    await this.eventBus.publish({ eventName: "subscription.updated", id: subscription.id, customerId: subscription.customerId });

    return subscription;
  }
}
