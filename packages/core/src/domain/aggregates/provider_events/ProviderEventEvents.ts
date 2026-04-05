// --- Provider Event Events ---

export class ProviderEventReceivedEvent {
  constructor(public readonly eventId: string, public readonly providerId: string, public readonly eventType: string, public readonly occurredAt: Date = new Date()) {}
}
