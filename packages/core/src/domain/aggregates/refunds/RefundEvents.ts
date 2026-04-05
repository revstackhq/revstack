// --- Refund Events ---

export class RefundCreatedEvent {
  constructor(public readonly refundId: string, public readonly paymentId: string, public readonly occurredAt: Date = new Date()) {}
}

export class RefundUpdatedEvent {
  constructor(public readonly refundId: string, public readonly status: string, public readonly occurredAt: Date = new Date()) {}
}
