export class UsageRecordedEvent {
  constructor(
    public readonly meterId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}
