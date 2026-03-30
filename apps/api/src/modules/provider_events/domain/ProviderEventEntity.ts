import { Entity } from "@/common/domain/Entity";

export interface ProviderEventProps {
  id?: string;
  providerId: string;
  externalEventId: string;
  eventType: string;
  payload: Record<string, any>;
  status: "pending" | "processed" | "failed";
  errorMessage: string | null;
  createdAt: Date;
  processedAt: Date | null;
}

export class ProviderEventEntity extends Entity<ProviderEventProps> {
  private constructor(props: ProviderEventProps) {
    super(props);
  }

  public static restore(props: ProviderEventProps): ProviderEventEntity {
    return new ProviderEventEntity(props);
  }

  public static ingest(
    providerId: string,
    externalEventId: string,
    eventType: string,
    payload: Record<string, any>,
  ): ProviderEventEntity {
    return new ProviderEventEntity({
      providerId,
      externalEventId,
      eventType,
      payload,
      status: "pending",
      errorMessage: null,
      createdAt: new Date(),
      processedAt: null,
    });
  }

  public markAsProcessed(): void {
    this.props.status = "processed";
    this.props.processedAt = new Date();
  }

  public markAsFailed(errorMessage: string): void {
    this.props.status = "failed";
    this.props.errorMessage = errorMessage;
    this.props.processedAt = new Date();
  }
}
