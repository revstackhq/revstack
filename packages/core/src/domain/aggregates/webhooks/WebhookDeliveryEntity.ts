import { Entity } from "@/domain/base/Entity";

export interface WebhookDeliveryProps {
  id?: string;
  endpointId: string;
  eventId: string;
  payload: Record<string, any>;
  status: "pending" | "success" | "failed";
  statusCode: number | null;
  responseBody: string | null;
  durationMs: number | null;
  createdAt: Date;
  nextRetryAt: Date | null;
  retryCount: number;
}

type CreateWebhookProps = Pick<
  WebhookDeliveryProps,
  "endpointId" | "eventId" | "payload"
>;
type WebhookResultProps = Pick<
  WebhookDeliveryProps,
  "statusCode" | "responseBody" | "durationMs"
>;

export class WebhookDeliveryEntity extends Entity<WebhookDeliveryProps> {
  private static readonly MAX_RETRIES = 3;

  private constructor(props: WebhookDeliveryProps) {
    super(props);
  }

  public static create(props: CreateWebhookProps): WebhookDeliveryEntity {
    return new WebhookDeliveryEntity({
      ...props,
      status: "pending",
      statusCode: null,
      responseBody: null,
      durationMs: null,
      createdAt: new Date(),
      nextRetryAt: null,
      retryCount: 0,
    });
  }

  public recordSuccess(props: WebhookResultProps): void {
    this.update({
      ...props,
      status: "success",
    });
  }

  public recordFailure(
    props: WebhookResultProps & { nextRetryAt: Date | null },
  ): void {
    this.update({
      ...props,
      status: "failed",
    });
  }

  public static restore(props: WebhookDeliveryProps): WebhookDeliveryEntity {
    return new WebhookDeliveryEntity(props);
  }

  public retry(): void {
    if (!this.canRetry()) {
      throw new Error("Cannot retry this webhook");
    }

    this.update({
      status: "pending",
      statusCode: null,
      responseBody: null,
      durationMs: null,
      nextRetryAt: null,
      retryCount: this.props.retryCount + 1,
    });
  }

  public canRetry(): boolean {
    return (
      this.props.status === "failed" &&
      this.props.retryCount < WebhookDeliveryEntity.MAX_RETRIES
    );
  }

  public isSuccess(): boolean {
    return this.props.status === "success";
  }

  private update(props: Partial<WebhookDeliveryProps>): void {
    Object.assign(this.props, props);
  }

  get status() {
    return this.props.status;
  }

  get retryCount() {
    return this.props.retryCount;
  }
}
