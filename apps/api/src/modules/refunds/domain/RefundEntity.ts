import { Entity } from "@/common/domain/Entity";

export interface RefundProps {
  id?: string;
  paymentId: string;
  amount: number;
  reason: string | null;
  status: "pending" | "succeeded" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export class RefundEntity extends Entity<RefundProps> {
  private constructor(props: RefundProps) {
    super(props);
  }

  public static restore(props: RefundProps): RefundEntity {
    return new RefundEntity(props);
  }

  public static create(
    paymentId: string,
    amount: number,
    reason?: string,
  ): RefundEntity {
    if (amount <= 0) {
      throw new Error("RefundAmountMustBePositive");
    }
    return new RefundEntity({
      paymentId,
      amount,
      reason: reason || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public markAsSucceeded(): void {
    if (this.props.status !== "pending") {
      throw new Error("OnlyPendingRefundsCanSucceed");
    }
    this.props.status = "succeeded";
    this.props.updatedAt = new Date();
  }

  public markAsFailed(): void {
    if (this.props.status !== "pending") {
      throw new Error("OnlyPendingRefundsCanFail");
    }
    this.props.status = "failed";
    this.props.updatedAt = new Date();
  }
}
