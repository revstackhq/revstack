export class EntitlementCreatedEvent {
  constructor(public readonly entitlementId: string, public readonly occurredAt: Date = new Date()) {}
}
