import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  InvalidUserEmailError,
  UserAlreadyInactiveError,
  UserEnvironmentRequiredError,
} from "./UserErrors";
import {
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserUpdatedEvent,
} from "./UserEvents";

export interface UserProps {
  id: string;
  environmentId: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserProps = Omit<
  UserProps,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;

export type UpdateUserProps = Partial<
  Pick<UserProps, "name" | "role" | "isActive" | "metadata">
>;

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static restore(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  public static create(props: CreateUserProps): UserEntity {
    if (!props.email.includes("@")) {
      throw new InvalidUserEmailError(props.email);
    }

    if (!props.environmentId) {
      throw new UserEnvironmentRequiredError();
    }

    const user = new UserEntity({
      ...props,
      id: generateId("usr"),
      name: props.name ?? null,
      isActive: true,
      metadata: props.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    user.addEvent(
      new UserCreatedEvent({
        userId: user.val.id,
        email: user.val.email,
        environmentId: user.val.environmentId,
        role: user.val.role,
      }),
    );

    return user;
  }

  public update(props: UpdateUserProps): void {
    const changes: string[] = [];

    if (props.name !== undefined && props.name !== this.props.name) {
      this.props.name = props.name;
      changes.push("name");
    }

    if (props.role !== undefined && props.role !== this.props.role) {
      this.props.role = props.role;
      changes.push("role");
    }

    if (
      props.isActive !== undefined &&
      props.isActive !== this.props.isActive
    ) {
      this.props.isActive = props.isActive;
      changes.push("isActive");
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
      changes.push("metadata");
    }

    if (changes.length > 0) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new UserUpdatedEvent({
          userId: this.val.id,
          environmentId: this.val.environmentId,
          changes,
        }),
      );
    }
  }

  public deactivate(reason?: string): void {
    if (!this.props.isActive) {
      throw new UserAlreadyInactiveError(this.val.id);
    }

    this.props.isActive = false;
    this.props.updatedAt = new Date();

    this.addEvent(
      new UserDeactivatedEvent({
        userId: this.val.id,
        environmentId: this.val.environmentId,
        email: this.val.email,
        reason: reason ?? "Manual deactivation",
      }),
    );
  }
}
