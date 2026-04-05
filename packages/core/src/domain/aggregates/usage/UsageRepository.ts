import type { UsageMeterEntity } from "@/domain/aggregates/usage/UsageMeterEntity";

export interface UsageRepository {
  save(meter: UsageMeterEntity): Promise<void>;
  findByCustomerAndFeature(customerId: string, featureId: string): Promise<UsageMeterEntity | null>;
  findMeterById(id: string): Promise<UsageMeterEntity | null>;
  findRecords(filters: { customerId?: string; featureId?: string }): Promise<any[]>;
}
