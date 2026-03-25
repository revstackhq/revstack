export class RefundEntity {
  constructor(
    public readonly id: string,
    public paymentId: string,
    public amount: number,
    public reason: string | null,
    public status: "pending" | "succeeded" | "failed",
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public static create(paymentId: string, amount: number, reason?: string): RefundEntity {
    if (amount <= 0) {
      throw new Error("RefundAmountMustBePositive");
    }
    return new RefundEntity(crypto.randomUUID(), paymentId, amount, reason || null, "pending");
  }

  public markAsSucceeded(): void {
    if (this.status !== "pending") {
      throw new Error("OnlyPendingRefundsCanSucceed");
    }
    this.status = "succeeded";
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    if (this.status !== "pending") {
      throw new Error("OnlyPendingRefundsCanFail");
    }
    this.status = "failed";
    this.updatedAt = new Date();
  }
}
