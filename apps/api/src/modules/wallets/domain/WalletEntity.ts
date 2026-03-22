export class WalletEntity {
  constructor(
    public readonly id: string,
    public customerId: string,
    public balance: number,
    public currency: string
  ) {}

  public static create(customerId: string, currency: string): WalletEntity {
    return new WalletEntity(crypto.randomUUID(), customerId, 0, currency);
  }

  public credit(amount: number): void {
    if (amount <= 0) {
      throw new Error("CreditAmountMustBePositive");
    }
    this.balance += amount;
  }

  public debit(amount: number): void {
    if (amount <= 0) {
      throw new Error("DebitAmountMustBePositive");
    }
    if (this.balance < amount) {
      throw new Error("InsufficientFunds");
    }
    this.balance -= amount;
  }
}
