import type { IUsageRepository } from "@/modules/usage/application/ports/IUsageRepository";
import type { UsageMeterEntity } from "@/modules/usage/domain/UsageMeterEntity";

export class PostgresUsageRepo implements IUsageRepository {
  constructor(private readonly db: any) {}

  async save(meter: UsageMeterEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findByCustomerAndFeature(customerId: string, featureId: string): Promise<UsageMeterEntity | null> {
    throw new Error("Method not implemented.");
  }
}
