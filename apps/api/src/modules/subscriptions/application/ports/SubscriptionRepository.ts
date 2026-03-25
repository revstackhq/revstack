import type { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";

export interface SubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<void>;
  findById(id: string): Promise<SubscriptionEntity | null>;
  findByCustomerId(customerId: string): Promise<SubscriptionEntity[]>;
  find(filters: { customerId?: string; planId?: string; status?: string }): Promise<SubscriptionEntity[]>;
}
