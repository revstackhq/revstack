export class WalletTransactionEntity {
  constructor(
    public readonly id: string,
    public walletId: string,
    public amount: number,
    public type: "credit" | "debit",
    public status: "completed" | "failed" | "pending",
    public referenceId: string | null,
    public createdAt: Date = new Date()
  ) {}

  public static create(
    walletId: string,
    amount: number,
    type: "credit" | "debit",
    referenceId?: string
  ): WalletTransactionEntity {
    if (amount <= 0) {
      throw new Error("TransactionAmountMustBePositive");
    }
    return new WalletTransactionEntity(
      crypto.randomUUID(),
      walletId,
      amount,
      type,
      "completed",
      referenceId || null
    );
  }
}
