import type { ISubscriptionRepository } from "@/modules/subscriptions/application/ports/ISubscriptionRepository";
import type { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";

export class PostgresSubscriptionRepo implements ISubscriptionRepository {
  constructor(private readonly db: any) {}

  async save(subscription: SubscriptionEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<SubscriptionEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findByCustomerId(customerId: string): Promise<SubscriptionEntity[]> {
    throw new Error("Method not implemented.");
  }
}
