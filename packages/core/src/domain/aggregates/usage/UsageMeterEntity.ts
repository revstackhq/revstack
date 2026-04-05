import { Entity } from "@/domain/base/Entity";

export interface UsageMeterProps {
  id?: string;
  customerId: string;
  featureId: string;
  currentUsage: number;
  periodStart: Date;
  periodEnd: Date;
}

export class UsageMeterEntity extends Entity<UsageMeterProps> {
  private constructor(props: UsageMeterProps) {
    super(props);
  }

  public static restore(props: UsageMeterProps): UsageMeterEntity {
    return new UsageMeterEntity(props);
  }

  public static create(
    customerId: string,
    featureId: string,
    periodStart: Date,
    periodEnd: Date,
  ): UsageMeterEntity {
    return new UsageMeterEntity({
      customerId,
      featureId,
      currentUsage: 0,
      periodStart,
      periodEnd,
    });
  }

  public record(amount: number): void {
    if (amount <= 0) {
      throw new Error("UsageAmountMustBePositive");
    }
    this.props.currentUsage += amount;
  }
}
