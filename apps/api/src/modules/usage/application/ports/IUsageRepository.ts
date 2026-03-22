import type { UsageMeterEntity } from "@/modules/usage/domain/UsageMeterEntity";

export interface IUsageRepository {
  save(meter: UsageMeterEntity): Promise<void>;
  findByCustomerAndFeature(customerId: string, featureId: string): Promise<UsageMeterEntity | null>;
}
