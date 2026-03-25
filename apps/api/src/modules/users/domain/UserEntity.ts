import { BadRequestError } from "@/common/errors/DomainError";

export interface UserProps {
  id: string;
  environmentId: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity {
  private constructor(private readonly props: UserProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get email() { return this.props.email; }
  get name() { return this.props.name; }
  get role() { return this.props.role; }
  get isActive() { return this.props.isActive; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  public static create(
    props: Omit<UserProps, "id" | "isActive" | "createdAt" | "updatedAt">
  ): UserEntity {
    if (!props.email.includes("@")) {
      throw new BadRequestError("Invalid email format", "INVALID_EMAIL");
    }

    if (!props.environmentId) {
      throw new BadRequestError("Environment ID is required", "MISSING_ENV_ID");
    }

    return new UserEntity({
      ...props,
      id: crypto.randomUUID(),
      isActive: true, // Default to active
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public update(props: Partial<Pick<UserProps, "name" | "role" | "isActive" | "metadata">>): void {
    if (props.name !== undefined) this.props.name = props.name;
    if (props.role !== undefined) this.props.role = props.role;
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    if (props.metadata !== undefined) this.props.metadata = { ...this.props.metadata, ...props.metadata };
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): UserProps {
    return { ...this.props };
  }
}
