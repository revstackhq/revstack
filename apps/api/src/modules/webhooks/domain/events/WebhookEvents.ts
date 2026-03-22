export class WebhookEndpointCreatedEvent {
  constructor(
    public readonly endpointId: string,
    public readonly url: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}
