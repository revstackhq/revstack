export class SubscriptionNotFoundError extends Error {
  constructor(id: string) {
    super(`Subscription with ID ${id} was not found.`);
    this.name = "SubscriptionNotFoundError";
  }
}

export class InvalidSubscriptionStateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSubscriptionStateTransitionError";
  }
}
