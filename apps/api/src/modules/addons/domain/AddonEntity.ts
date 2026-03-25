import { BadRequestError } from "@/common/errors/DomainError";

export interface AddonProps {
  id: string;
  environmentId: string;
  name: string;
  type: string; // e.g. "flat", "metered"
  isArchived: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class AddonEntity {
  private constructor(private readonly props: AddonProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get name() { return this.props.name; }
  get type() { return this.props.type; }
  get isArchived() { return this.props.isArchived; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: AddonProps): AddonEntity {
    return new AddonEntity(props);
  }

  public static create(
    props: Omit<AddonProps, "id" | "isArchived" | "createdAt" | "updatedAt">
  ): AddonEntity {
    if (!props.name) {
      throw new BadRequestError("Addon name is required", "NAME_REQUIRED");
    }
    if (!props.type) {
      throw new BadRequestError("Addon type is required", "TYPE_REQUIRED");
    }

    return new AddonEntity({
      ...props,
      id: crypto.randomUUID(),
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public archive(): void {
    if (this.props.isArchived) {
      throw new BadRequestError("Addon is already archived", "ALREADY_ARCHIVED");
    }
    this.props.isArchived = true;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): AddonProps {
    return { ...this.props };
  }
}
