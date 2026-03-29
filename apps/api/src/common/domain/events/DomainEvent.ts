export abstract class DomainEvent<T = any> {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public abstract readonly eventName: string;

  constructor(public readonly payload: T) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}
