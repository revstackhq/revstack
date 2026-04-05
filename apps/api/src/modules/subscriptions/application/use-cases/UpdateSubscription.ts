import { z } from "zod";
import type { SubscriptionRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { NotFoundError } from "@revstackhq/core";

export const updateSubscriptionSchema = z.object({
  planId: z.string().optional(),
  priceId: z.string().optional(),
  couponId: z.string().nullable().optional(),
  isAutoRenew: z.boolean().optional(),
});

export type UpdateSubscriptionCommand = {
  id: string;
} & z.infer<typeof updateSubscriptionSchema>;

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
