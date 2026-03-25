import { BadRequestError } from "@/common/errors/DomainError";

export interface EnvironmentProps {
  id: string;
  projectId: string;
  name: string;
  isDefault: boolean;
  type: "sandbox" | "live";
  createdAt: Date;
}

export class EnvironmentEntity {
  private constructor(private readonly props: EnvironmentProps) {}

  get id() { return this.props.id; }
  get projectId() { return this.props.projectId; }
  get name() { return this.props.name; }
  get isDefault() { return this.props.isDefault; }
  get type() { return this.props.type; }
  get createdAt() { return this.props.createdAt; }

  public static restore(props: EnvironmentProps): EnvironmentEntity {
    return new EnvironmentEntity(props);
  }

  public static create(props: Omit<EnvironmentProps, "id" | "isDefault" | "createdAt" | "type">): EnvironmentEntity {
    if (!props.projectId) {
      throw new BadRequestError("Project ID is required", "MISSING_PROJECT_ID");
    }
    if (!props.name) {
      throw new BadRequestError("Environment name is required", "MISSING_NAME");
    }

    return new EnvironmentEntity({
      ...props,
      id: crypto.randomUUID(),
      type: "sandbox", // User-created envs are mostly sandbox by default, unless otherwise specified
      isDefault: false,
      createdAt: new Date(),
    });
  }

  public updateName(name: string): void {
    if (this.isDefault) {
      throw new BadRequestError("Cannot update default environment", "DEFAULT_ENV_LOCKED");
    }
    this.props.name = name;
  }

  public delete(): void {
    if (this.isDefault) {
      throw new BadRequestError("Cannot delete default environment", "DEFAULT_ENV_LOCKED");
    }
  }

  public toPrimitives(): EnvironmentProps {
    return { ...this.props };
  }
}
