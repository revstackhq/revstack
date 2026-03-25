import type { SubscriptionRepository } from "@/modules/subscriptions/application/ports/SubscriptionRepository";
import type { SubscriptionEntity } from "@/modules/subscriptions/domain/SubscriptionEntity";

export class PostgresSubscriptionRepo implements SubscriptionRepository {
  constructor(private readonly db: any) {}

  async save(subscription: SubscriptionEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<SubscriptionEntity | null> {
    throw new Error("Method not implemented.");
  }

  public async find(filters?: any): Promise<SubscriptionEntity[]> {
    return []; // Implement
  }

  async findByCustomerId(customerId: string): Promise<SubscriptionEntity[]> {
    throw new Error("Method not implemented.");
  }
}
