export class PriceEntity {
  constructor(
    public readonly id: string | undefined,
    public planId: string,
    public amount: number,
    public currency: string,
    public interval: "month" | "year" | "one_time",
  ) {}

  public static create(planId: string, amount: number, currency: string, interval: "month" | "year" | "one_time"): PriceEntity {
    if (amount <= 0) {
      throw new Error("PriceAmountMustBePositive");
    }
    return new PriceEntity(undefined, planId, amount, currency, interval);
  }
}
