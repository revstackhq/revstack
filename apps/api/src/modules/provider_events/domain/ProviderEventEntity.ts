export class ProviderEventEntity {
  constructor(
    public readonly id: string,
    public providerId: string,
    public externalEventId: string,
    public eventType: string,
    public payload: Record<string, any>,
    public status: "pending" | "processed" | "failed",
    public errorMessage: string | null = null,
    public createdAt: Date = new Date(),
    public processedAt: Date | null = null
  ) {}

  public static ingest(providerId: string, externalEventId: string, eventType: string, payload: Record<string, any>): ProviderEventEntity {
    return new ProviderEventEntity(
      crypto.randomUUID(),
      providerId,
      externalEventId,
      eventType,
      payload,
      "pending"
    );
  }

  public markAsProcessed(): void {
    this.status = "processed";
    this.processedAt = new Date();
  }

  public markAsFailed(errorMessage: string): void {
    this.status = "failed";
    this.errorMessage = errorMessage;
    this.processedAt = new Date();
  }
}
