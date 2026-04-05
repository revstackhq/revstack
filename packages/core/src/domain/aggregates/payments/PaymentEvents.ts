// --- Payment Events ---

export class PaymentProcessedEvent {
  constructor(public readonly paymentId: string, public readonly invoiceId: string, public readonly occurredAt: Date = new Date()) {}
}
