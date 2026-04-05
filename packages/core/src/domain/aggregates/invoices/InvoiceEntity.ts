import { Entity } from "@/domain/base/Entity";

export interface InvoiceProps {
  id?: string;
  customerId: string;
  totalAmount: number;
  currency: string;
  status: "draft" | "open" | "paid" | "void" | "uncollectible";
  dueDate?: Date;
  createdAt: Date;
}

export class InvoiceEntity extends Entity<InvoiceProps> {
  private constructor(props: InvoiceProps) {
    super(props);
  }

  public static restore(props: InvoiceProps): InvoiceEntity {
    return new InvoiceEntity(props);
  }

  public static createDraft(
    customerId: string,
    currency: string,
    dueDate?: Date,
  ): InvoiceEntity {
    return new InvoiceEntity({
      customerId,
      totalAmount: 0,
      currency,
      status: "draft",
      dueDate,
      createdAt: new Date(),
    });
  }

  public addAmount(amount: number): void {
    this.props.totalAmount += amount;
  }

  public markAsPaid(): void {
    if (this.props.status === "paid") {
      throw new Error("InvoiceAlreadyPaid");
    }
    this.props.status = "paid";
  }

  public markAsVoid(): void {
    if (this.props.status === "paid" || this.props.status === "void") {
      throw new Error("CannotVoidInvoice");
    }
    this.props.status = "void";
  }
}
