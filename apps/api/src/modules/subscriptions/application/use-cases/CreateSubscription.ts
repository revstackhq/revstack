import { z } from "zod";
import type { SubscriptionRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import { SubscriptionEntity } from "@revstackhq/core";
import { SubscriptionCreatedEvent } from "@revstackhq/core";

export const createSubscriptionSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  planId: z.string().min(1, "Plan ID is required"),
  priceId: z.string().min(1, "Price ID is required"),
  couponId: z.string().optional(),
});

export type CreateSubscriptionCommand = z.infer<typeof createSubscriptionSchema>;

export class CreateSubscriptionHandler {
  constructor(
    private readonly repository: SubscriptionRepository,
    private readonly eventBus: EventBus,
    private readonly cache: CacheService
  ) {}

  public async execute(command: CreateSubscriptionCommand) {
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
