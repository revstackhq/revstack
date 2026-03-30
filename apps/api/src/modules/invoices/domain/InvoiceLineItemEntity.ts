export class InvoiceLineItemEntity {
  constructor(
    public readonly id: string | undefined,
    public invoiceId: string,
    public name: string,
    public periodStart: Date,
    public periodEnd: Date,
    public amount: number,
    public currency: string,
    public quantity: number = 1,
  ) {}

  public static create(
    invoiceId: string,
    name: string,
    periodStart: Date,
    periodEnd: Date,
    amount: number,
    currency: string,
    quantity: number = 1,
  ): InvoiceLineItemEntity {
    return new InvoiceLineItemEntity(
      undefined,
      invoiceId,
      name,
      periodStart,
      periodEnd,
      amount,
      currency,
      quantity,
    );
  }

  public update(props: { name?: string; periodStart?: Date; periodEnd?: Date; amount?: number; quantity?: number }): void {
    if (props.name) this.name = props.name;
    if (props.periodStart) this.periodStart = props.periodStart;
    if (props.periodEnd) this.periodEnd = props.periodEnd;
    if (props.amount !== undefined) this.amount = props.amount;
    if (props.quantity !== undefined) this.quantity = props.quantity;
  }
}
