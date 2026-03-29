import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface EnvironmentProps {
  id?: string;
  projectId?: string | null;
  name: string;
  slug: string;
  isDefault: boolean;
  createdAt: Date;
}

export class EnvironmentEntity extends Entity<EnvironmentProps> {
  private constructor(props: EnvironmentProps) {
    super(props);
  }

  public static restore(props: EnvironmentProps): EnvironmentEntity {
    return new EnvironmentEntity(props);
  }

  public static create(
    props: Omit<EnvironmentProps, "id" | "createdAt">,
  ): EnvironmentEntity {
    if (!props.name) {
      throw new BadRequestError("Environment name is required", "MISSING_NAME");
    }

    if (!props.slug) {
      throw new BadRequestError("Environment slug is required", "MISSING_SLUG");
    }

    return new EnvironmentEntity({
      ...props,
      createdAt: new Date(),
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
        "Cannot delete default environment",
        "DEFAULT_ENV_LOCKED",
      );
    }
  }
}
