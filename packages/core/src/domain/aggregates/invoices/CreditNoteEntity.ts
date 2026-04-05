import { Entity } from "@/domain/base/Entity";

export interface CreditNoteProps {
  id?: string;
  invoiceId: string;
  amount: number;
  reason: string | null;
  status: "issued" | "void";
  createdAt: Date;
}

export class CreditNoteEntity extends Entity<CreditNoteProps> {
  private constructor(props: CreditNoteProps) {
    super(props);
  }

  public static restore(props: CreditNoteProps): CreditNoteEntity {
    return new CreditNoteEntity(props);
  }

  public static issue(
    invoiceId: string,
    amount: number,
    reason?: string,
  ): CreditNoteEntity {
    if (amount <= 0) {
      throw new Error("CreditNoteAmountMustBePositive");
    }
    return new CreditNoteEntity({
      invoiceId,
      amount,
      reason: reason || null,
      status: "issued",
      createdAt: new Date(),
    });
  }

  public void(): void {
    if (this.props.status === "void") {
      throw new Error("CreditNoteAlreadyVoided");
    }
    this.props.status = "void";
  }
}
