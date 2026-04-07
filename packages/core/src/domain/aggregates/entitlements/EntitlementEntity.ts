import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  EntitlementCreatedEvent,
  EntitlementUpdatedEvent,
  EntitlementArchivedEvent,
} from "@/domain/aggregates/entitlements/EntitlementEvents";
import { EntitlementAlreadyArchivedError } from "@/domain/aggregates/entitlements/EntitlementErrors";

export type EntitlementType = "boolean" | "metered" | "static" | "json";
export type EntitlementUnitType =
  | "count"
  | "bytes"
  | "seconds"
  | "tokens"
  | "requests"
  | "custom";

export type EntitlementStatus = "draft" | "active" | "archived";

export interface EntitlementProps {
  id: string;
  environmentId: string;
  slug: string;
  name: string;
  description?: string;
  type: EntitlementType;
  unitType: EntitlementUnitType;
  status: EntitlementStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEntitlementProps = Omit<
  EntitlementProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateEntitlementProps = Partial<
  Pick<EntitlementProps, "name" | "description" | "metadata" | "status">
>;

export class EntitlementEntity extends Entity<EntitlementProps> {
  private constructor(props: EntitlementProps) {
    super(props);
  }

  public static restore(props: EntitlementProps): EntitlementEntity {
    return new EntitlementEntity(props);
  }

  public static create(props: CreateEntitlementProps): EntitlementEntity {
    const entity = new EntitlementEntity({
      ...props,
      id: generateId("ent"),
      status: "active",
      metadata: props.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
      description: props.description ?? undefined,
    });

    entity.addEvent(
      new EntitlementCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        slug: entity.val.slug,
      }),
    );

    return entity;
  }

  public update(props: UpdateEntitlementProps): void {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }

    if (props.description !== undefined) {
      this.props.description = props.description;
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    }

    if (props.status !== undefined) {
      this.props.status = props.status;
    }

    this.props.updatedAt = new Date();

    this.addEvent(
      new EntitlementUpdatedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new EntitlementAlreadyArchivedError(this.val.id);
    }

    this.props.status = "archived";
    this.props.updatedAt = new Date();

    this.addEvent(
      new EntitlementArchivedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }
}
