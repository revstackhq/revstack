export class PaymentEntity {
  constructor(
    public readonly id: string,
    public invoiceId: string,
    public amount: number,
    public method: string,
    public status: "pending" | "succeeded" | "failed" | "refunded",
    public processedAt: Date = new Date()
  ) {}

  public static process(invoiceId: string, amount: number, method: string): PaymentEntity {
    if (amount <= 0) {
      throw new Error("PaymentAmountMustBePositive");
    }
    return new PaymentEntity(crypto.randomUUID(), invoiceId, amount, method, "succeeded");
  }

  public refund(): void {
    if (this.status !== "succeeded") {
      throw new Error("CanOnlyRefundSucceededPayments");
    }
    this.status = "refunded";
  }
}
