import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  ProviderEventAlreadyProcessedError,
  InvalidProviderEventDataError,
} from "./ProviderEventErrors";
import { ProviderEventType } from "@/types";

export type ProviderEventStatus = "pending" | "processed" | "failed";

export interface ProviderEventProps {
  id: string;
  environmentId: string;
  providerId: string;
  externalEventId: string;
  eventType: ProviderEventType;
  resourceId: string;
  customerId: string | null;
  payload: Record<string, any>;
  status: ProviderEventStatus;
  errorMessage: string | null;
  createdAt: Date;
  processedAt: Date | null;
}

export type IngestProviderEventProps = Omit<
  ProviderEventProps,
  "id" | "status" | "errorMessage" | "createdAt" | "processedAt"
>;

export class ProviderEventEntity extends Entity<ProviderEventProps> {
  private constructor(props: ProviderEventProps) {
    super(props);
  }

  public static restore(props: ProviderEventProps): ProviderEventEntity {
    return new ProviderEventEntity(props);
  }

  public static ingest(props: IngestProviderEventProps): ProviderEventEntity {
    if (!props.externalEventId) {
      throw new InvalidProviderEventDataError(
        "External event ID is required for idempotency",
      );
    }

    return new ProviderEventEntity({
      ...props,
      id: generateId("pevt"),
      status: "pending",
      errorMessage: null,
      createdAt: new Date(),
      processedAt: null,
    });
  }

  public succeed(): void {
    if (this.props.status === "processed") {
      throw new ProviderEventAlreadyProcessedError(this.val.externalEventId);
    }

    this.props.status = "processed";
    this.props.processedAt = new Date();
    this.props.errorMessage = null;
  }

  public fail(message: string): void {
    this.props.status = "failed";
    this.props.errorMessage = message;
    this.props.processedAt = new Date();
  }

  public get isPending(): boolean {
    return this.props.status === "pending";
  }
}
