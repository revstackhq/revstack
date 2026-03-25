import type { UsageRepository } from "@/modules/usage/application/ports/UsageRepository";
import type { UsageMeterEntity } from "@/modules/usage/domain/UsageMeterEntity";

export class PostgresUsageRepo implements UsageRepository {
  constructor(private readonly db: any) {}

  async save(meter: UsageMeterEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async saveMeter(meter: any): Promise<void> {
    // Implement
  }

  public async findMeterById(id: string): Promise<UsageMeterEntity | null> {
    return null;
  }

  public async findRecords(filters?: any): Promise<any[]> {
    return [];
  }

  async findByCustomerAndFeature(
    customerId: string,
    featureId: string,
  ): Promise<UsageMeterEntity | null> {
    throw new Error("Method not implemented.");
  }
}
