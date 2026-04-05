import { Entity } from "@/domain/base/Entity";
import { BadRequestError } from "@/domain/base/DomainError";

export interface EnvironmentProps {
  id?: string;
  projectId?: string | null;
  name: string;
  slug: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class EnvironmentEntity extends Entity<EnvironmentProps> {
  private constructor(props: EnvironmentProps) {
    super(props);
  }

  public static restore(props: EnvironmentProps): EnvironmentEntity {
    return new EnvironmentEntity(props);
  }

  public static create(
    props: Omit<EnvironmentProps, "id" | "createdAt" | "updatedAt">,
  ): EnvironmentEntity {
    if (!props.name) {
      throw new BadRequestError("Environment name is required", "MISSING_NAME");
    }

    if (!props.slug) {
      throw new BadRequestError("Environment slug is required", "MISSING_SLUG");
    }

    if (
      props.isDefault &&
      props.slug !== "sandbox" &&
      props.slug !== "production"
    ) {
      throw new BadRequestError(
        "Default environment slug must be sandbox or production",
        "INVALID_DEFAULT_ENV_SLUG",
      );
    }

    return new EnvironmentEntity({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateName(name: string): void {
    if (this.val.isDefault) {
      throw new BadRequestError(
        "Cannot update default environment name",
        "DEFAULT_ENV_LOCKED",
      );
    }
    this.props.name = name;
  }

  public canBeDeleted(): void {
    if (this.val.isDefault) {
      throw new BadRequestError(
        "Cannot delete default environments",
        "DEFAULT_ENV_LOCKED",
      );
    }
  }
}
