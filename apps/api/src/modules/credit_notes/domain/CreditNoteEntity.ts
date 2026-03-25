export class CreditNoteEntity {
  constructor(
    public readonly id: string,
    public invoiceId: string,
    public amount: number,
    public reason: string | null,
    public status: "issued" | "void",
    public createdAt: Date = new Date()
  ) {}

  public static issue(invoiceId: string, amount: number, reason?: string): CreditNoteEntity {
    if (amount <= 0) {
      throw new Error("CreditNoteAmountMustBePositive");
    }
    return new CreditNoteEntity(crypto.randomUUID(), invoiceId, amount, reason || null, "issued");
  }

  public void(): void {
    if (this.status === "void") {
      throw new Error("CreditNoteAlreadyVoided");
    }
    this.status = "void";
  }
}
