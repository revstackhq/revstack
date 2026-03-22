import type { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";

export interface ISubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<void>;
  findById(id: string): Promise<SubscriptionEntity | null>;
  findByCustomerId(customerId: string): Promise<SubscriptionEntity[]>;
}
