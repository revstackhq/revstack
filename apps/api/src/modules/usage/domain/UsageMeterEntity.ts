export class UsageMeterEntity {
  constructor(
    public readonly id: string,
    public customerId: string,
    public featureId: string,
    public currentUsage: number,
    public periodStart: Date,
    public periodEnd: Date
  ) {}

  public static create(customerId: string, featureId: string, periodStart: Date, periodEnd: Date): UsageMeterEntity {
    return new UsageMeterEntity(crypto.randomUUID(), customerId, featureId, 0, periodStart, periodEnd);
  }

  public record(amount: number): void {
    if (amount <= 0) {
      throw new Error("UsageAmountMustBePositive");
    }
    this.currentUsage += amount;
  }
}
