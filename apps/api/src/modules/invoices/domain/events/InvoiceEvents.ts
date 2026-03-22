export class InvoiceCreatedEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly customerId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

export class PaymentProcessedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly invoiceId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
