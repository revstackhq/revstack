// --- Subscription Events ---

export class SubscriptionCreatedEvent {
  constructor(public readonly subscriptionId: string, public readonly occurredAt: Date = new Date()) {}
}

export class SubscriptionCancelledEvent {
  constructor(public readonly subscriptionId: string, public readonly occurredAt: Date = new Date()) {}
}

export class SubscriptionUpdatedEvent {
  constructor(public readonly subscriptionId: string, public readonly occurredAt: Date = new Date()) {}
}
