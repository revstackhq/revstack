import {
  SubscriptionEntity,
  SubscriptionStatus,
} from "../subscriptions/SubscriptionEntity";

export interface SubscriptionRepository {
  save(subscription: SubscriptionEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<SubscriptionEntity | null>;

  findByExternalId(params: {
    environmentId: string;
    externalSubscriptionId: string;
  }): Promise<SubscriptionEntity | null>;

  list(params: {
    environmentId: string;
    customerId?: string;
    planId?: string;
    status?: SubscriptionStatus;
  }): Promise<SubscriptionEntity[]>;

  findPendingSchedules(params: {
    environmentId: string;
    effectiveBefore: Date;
  }): Promise<SubscriptionEntity[]>;
}
