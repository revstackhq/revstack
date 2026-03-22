export class SubscriptionCreatedEvent {
  constructor(public readonly subscriptionId: string, public readonly occurredAt: Date = new Date()) {}
}
