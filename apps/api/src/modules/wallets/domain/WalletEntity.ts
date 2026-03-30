import { Entity } from "@/common/domain/Entity";

export interface WalletProps {
  id?: string;
  customerId: string;
  balance: number;
  currency: string;
}

export class WalletEntity extends Entity<WalletProps> {
  private constructor(props: WalletProps) {
    super(props);
  }

  public static restore(props: WalletProps): WalletEntity {
    return new WalletEntity(props);
  }

  public static create(
    customerId: string,
    currency: string,
  ): WalletEntity {
    return new WalletEntity({
      customerId,
      balance: 0,
      currency,
    });
  }

  public credit(amount: number): void {
    if (amount <= 0) {
      throw new Error("CreditAmountMustBePositive");
    }
    this.props.balance += amount;
  }

  public debit(amount: number): void {
    if (amount <= 0) {
      throw new Error("DebitAmountMustBePositive");
    }
    if (this.props.balance < amount) {
      throw new Error("InsufficientFunds");
    }
    this.props.balance -= amount;
  }
}
