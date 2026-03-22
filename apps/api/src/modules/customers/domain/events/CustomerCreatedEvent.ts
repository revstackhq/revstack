export class CustomerCreatedEvent {
  constructor(public readonly customerId: string, public readonly occurredAt: Date = new Date()) {}
}
