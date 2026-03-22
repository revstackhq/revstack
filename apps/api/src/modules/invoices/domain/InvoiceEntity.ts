export class InvoiceEntity {
  constructor(
    public readonly id: string,
    public customerId: string,
    public totalAmount: number,
    public currency: string,
    public status: "draft" | "open" | "paid" | "void" | "uncollectible",
    public dueDate?: Date,
    public createdAt: Date = new Date()
  ) {}

  public static createDraft(customerId: string, currency: string, dueDate?: Date): InvoiceEntity {
    return new InvoiceEntity(crypto.randomUUID(), customerId, 0, currency, "draft", dueDate);
  }

  public markAsPaid(): void {
    if (this.status === "paid") {
      throw new Error("InvoiceAlreadyPaid");
    }
    this.status = "paid";
  }

  public markAsVoid(): void {
    if (this.status === "paid" || this.status === "void") {
      throw new Error("CannotVoidInvoice");
    }
    this.status = "void";
  }
}
