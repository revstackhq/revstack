import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";
import {
  AddonCreatedEvent,
  AddonArchivedEvent,
} from "@/modules/addons/domain/events/AddonEvents";

export interface AddonProps {
  id?: string;
  environmentId: string;
  name: string;
  type: string;
  isArchived: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class AddonEntity extends Entity<AddonProps> {
  private constructor(props: AddonProps) {
    super(props);
  }

  public static restore(props: AddonProps): AddonEntity {
    return new AddonEntity(props);
  }

  public static create(
    props: Omit<AddonProps, "id" | "isArchived" | "createdAt" | "updatedAt">,
  ): AddonEntity {
    if (!props.name) {
      throw new BadRequestError("Addon name is required", "NAME_REQUIRED");
    }
    if (!props.type) {
      throw new BadRequestError("Addon type is required", "TYPE_REQUIRED");
    }

    const entity = new AddonEntity({
      ...props,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new AddonCreatedEvent({
        environment_id: props.environmentId,
      }),
    );

    return entity;
  }

  public archive(): void {
    if (this.props.isArchived) {
      throw new BadRequestError(
        "Addon is already archived",
        "ALREADY_ARCHIVED",
      );
    }
    this.props.isArchived = true;
    this.props.updatedAt = new Date();

    this.addEvent(
      new AddonArchivedEvent({
        id: this.val.id!,
        environment_id: this.val.environmentId,
      }),
    );
  }
}
