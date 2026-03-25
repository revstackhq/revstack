export class WebhookDeliveryEntity {
  constructor(
    public readonly id: string,
    public endpointId: string,
    public eventId: string,
    public payload: Record<string, any>,
    public status: "pending" | "success" | "failed",
    public statusCode: number | null,
    public responseBody: string | null,
    public durationMs: number | null,
    public createdAt: Date = new Date(),
    public nextRetryAt: Date | null = null,
    public retryCount: number = 0
  ) {}

  public static create(endpointId: string, eventId: string, payload: Record<string, any>): WebhookDeliveryEntity {
    return new WebhookDeliveryEntity(
      crypto.randomUUID(),
      endpointId,
      eventId,
      payload,
      "pending",
      null,
      null,
      null
    );
  }

  public recordSuccess(statusCode: number, responseBody: string, durationMs: number): void {
    this.status = "success";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    this.durationMs = durationMs;
  }

  public recordFailure(statusCode: number | null, responseBody: string, durationMs: number | null, nextRetryAt: Date | null): void {
    this.status = "failed";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
    this.durationMs = durationMs;
    this.nextRetryAt = nextRetryAt;
    this.retryCount += 1;
  }
}
