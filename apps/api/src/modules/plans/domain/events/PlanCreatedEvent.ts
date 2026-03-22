export class PlanCreatedEvent {
  constructor(public readonly planId: string, public readonly occurredAt: Date = new Date()) {}
}
