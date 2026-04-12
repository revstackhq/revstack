import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  InvalidRefundStatusError,
  InvalidRefundAmountError,
} from "./RefundErrors";
import {
  RefundCreatedEvent,
  RefundSucceededEvent,
  RefundFailedEvent,
} from "./RefundEvents";

export type RefundStatus = "pending" | "succeeded" | "failed";

export interface RefundProps {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string | null;
  status: RefundStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRefundProps = Omit<
  RefundProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export class RefundEntity extends Entity<RefundProps> {
  private constructor(props: RefundProps) {
    super(props);
  }

  public static restore(props: RefundProps): RefundEntity {
    return new RefundEntity(props);
  }

  public static create(props: CreateRefundProps): RefundEntity {
    if (props.amount <= 0) {
      throw new InvalidRefundAmountError(props.amount);
    }

    const refund = new RefundEntity({
      ...props,
      id: generateId("ref"),
      status: "pending",
      reason: props.reason ?? null,
      metadata: props.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    refund.addEvent(
      new RefundCreatedEvent({
        id: refund.val.id,
        paymentId: refund.val.paymentId,
        amount: refund.val.amount,
        currency: refund.val.currency,
      }),
    );

    return refund;
  }

  public succeed(): void {
    if (this.props.status !== "pending") {
      throw new InvalidRefundStatusError(this.props.status);
    }

    this.props.status = "succeeded";
    this.props.updatedAt = new Date();

    this.addEvent(
      new RefundSucceededEvent({
        id: this.val.id,
        paymentId: this.val.paymentId,
      }),
    );
  }

  public fail(reason?: string): void {
    if (this.props.status !== "pending") {
      throw new InvalidRefundStatusError(this.props.status);
    }

    this.props.status = "failed";
    this.props.updatedAt = new Date();

    if (reason) {
      this.props.metadata = { ...this.props.metadata, failure_reason: reason };
    }

    this.addEvent(
      new RefundFailedEvent({
        id: this.val.id,
        paymentId: this.val.paymentId,
        reason: reason ?? "Unknown failure",
      }),
    );
  }

  public get isPending(): boolean {
    return this.props.status === "pending";
  }

  public get amount(): number {
    return this.props.amount;
  }
}
