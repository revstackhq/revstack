import { Entity } from "@/domain/base/Entity";
import { BadRequestError } from "@/domain/base/DomainError";

export interface UserProps {
  id?: string;
  environmentId: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static restore(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  public static create(
    props: Omit<UserProps, "id" | "isActive" | "createdAt" | "updatedAt">,
  ): UserEntity {
    if (!props.email.includes("@")) {
      throw new BadRequestError("Invalid email format", "INVALID_EMAIL");
    }

    if (!props.environmentId) {
      throw new BadRequestError("Environment ID is required", "MISSING_ENV_ID");
    }

    return new UserEntity({
      ...props,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(
    props: Partial<Pick<UserProps, "name" | "role" | "isActive" | "metadata">>,
  ): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.role !== undefined) this.props.role = props.role;
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    if (props.metadata !== undefined)
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }
}
