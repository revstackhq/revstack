import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  EnvironmentNameRequiredError,
  EnvironmentSlugRequiredError,
  ProtectedEnvironmentError,
} from "./EnvironmentErrors";
import {
  EnvironmentCreatedEvent,
  EnvironmentUpdatedEvent,
} from "./EnvironmentEvents";

export interface EnvironmentProps {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEnvironmentProps = Omit<
  EnvironmentProps,
  "id" | "createdAt" | "updatedAt" | "isDefault"
>;

export type UpdateEnvironmentProps = Partial<Pick<EnvironmentProps, "name">>;

export class EnvironmentEntity extends Entity<EnvironmentProps> {
  private constructor(props: EnvironmentProps) {
    super(props);
  }

  public static restore(props: EnvironmentProps): EnvironmentEntity {
    return new EnvironmentEntity(props);
  }

  public static create(props: CreateEnvironmentProps): EnvironmentEntity {
    if (!props.name) throw new EnvironmentNameRequiredError();
    if (!props.slug) throw new EnvironmentSlugRequiredError();

    const normalizedSlug = props.slug.toLowerCase().trim();

    const environment = new EnvironmentEntity({
      ...props,
      slug: normalizedSlug,
      id: generateId("env"),
      isDefault: ["production", "sandbox"].includes(normalizedSlug),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    environment.addEvent(
      new EnvironmentCreatedEvent({
        id: environment.val.id,
        projectId: environment.val.projectId,
        slug: environment.val.slug,
      }),
    );

    return environment;
  }

  public update(props: UpdateEnvironmentProps): void {
    if (this.isCoreEnvironment()) {
      throw new ProtectedEnvironmentError("update");
    }

    if (props.name && props.name !== this.props.name) {
      this.props.name = props.name;
      this.props.updatedAt = new Date();

      this.addEvent(
        new EnvironmentUpdatedEvent({
          id: this.val.id,
          projectId: this.val.projectId,
          changes: ["name"],
        }),
      );
    }
  }

  public assertCanBeDeleted(): void {
    if (this.isCoreEnvironment()) {
      throw new ProtectedEnvironmentError("delete");
    }
  }

  private isCoreEnvironment(): boolean {
    return this.props.isDefault;
  }
}
