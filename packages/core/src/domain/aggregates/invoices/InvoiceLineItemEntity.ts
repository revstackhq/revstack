import { Entity } from "@/domain/base/Entity";

interface InvoiceLineItemProps {
  id?: string;
  invoiceId: string;
  name: string;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  currency: string;
  quantity: number;
}

export class InvoiceLineItemEntity extends Entity<InvoiceLineItemProps> {
  constructor(props: InvoiceLineItemProps) {
    super(props);
  }

  public static create(
    props: Omit<InvoiceLineItemProps, "id">,
  ): InvoiceLineItemEntity {
    const lineItem = new InvoiceLineItemEntity(props);

    return lineItem;
  }

  public update(props: {
    name?: string;
    periodStart?: Date;
    periodEnd?: Date;
    amount?: number;
    quantity?: number;
  }): void {
    if (props.name) this.props.name = props.name;
    if (props.periodStart) this.props.periodStart = props.periodStart;
    if (props.periodEnd) this.props.periodEnd = props.periodEnd;
    if (props.amount !== undefined) this.props.amount = props.amount;
    if (props.quantity !== undefined) this.props.quantity = props.quantity;
  }
}
