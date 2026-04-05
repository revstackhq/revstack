// --- Integration Events ---

export class IntegrationInstalledEvent {
  constructor(public readonly integrationId: string, public readonly occurredAt: Date = new Date()) {}
}

export class IntegrationConfigUpdatedEvent {
  constructor(public readonly integrationId: string, public readonly occurredAt: Date = new Date()) {}
}
