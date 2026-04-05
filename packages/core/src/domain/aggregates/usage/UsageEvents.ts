// --- Usage Events ---

export class UsageRecordedEvent {
  constructor(
    public readonly meterId: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date()
  ) {}
}

export class UsageMeterCreatedEvent {
  constructor(public readonly meterId: string, public readonly occurredAt: Date = new Date()) {}
}

export class UsageMeterUpdatedEvent {
  constructor(public readonly meterId: string, public readonly occurredAt: Date = new Date()) {}
}
