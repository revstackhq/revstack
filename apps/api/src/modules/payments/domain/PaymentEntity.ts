import { Entity } from "@/common/domain/Entity";

export interface PaymentProps {
  id?: string;
  invoiceId: string;
  amount: number;
  method: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  processedAt: Date;
}

export class PaymentEntity extends Entity<PaymentProps> {
  private constructor(props: PaymentProps) {
    super(props);
  }

  public static restore(props: PaymentProps): PaymentEntity {
    return new PaymentEntity(props);
  }

  public static process(
    invoiceId: string,
    amount: number,
    method: string,
  ): PaymentEntity {
    if (amount <= 0) {
      throw new Error("PaymentAmountMustBePositive");
    }

    return new PaymentEntity({
      invoiceId,
      amount,
      method,
      status: "succeeded",
      processedAt: new Date(),
    });
  }

  public refund(): void {
    if (this.props.status !== "succeeded") {
      throw new Error("CanOnlyRefundSucceededPayments");
    }
    this.props.status = "refunded";
  }
}
