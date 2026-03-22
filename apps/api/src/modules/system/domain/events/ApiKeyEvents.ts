export class ApiKeyCreatedEvent {
  constructor(
    public readonly apiKeyId: string,
    public readonly tenantId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
