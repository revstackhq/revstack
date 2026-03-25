import { BadRequestError } from "@/common/errors/DomainError";

export interface StudioAdminProps {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  isSuperadmin: boolean;
  isActive: boolean;
  createdAt: Date;
}

export class StudioAdminEntity {
  private constructor(private readonly props: StudioAdminProps) {}

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get name() { return this.props.name; }
  get isSuperadmin() { return this.props.isSuperadmin; }
  get isActive() { return this.props.isActive; }
  get createdAt() { return this.props.createdAt; }

  public static restore(props: StudioAdminProps): StudioAdminEntity {
    return new StudioAdminEntity(props);
  }

  public static create(
    props: Omit<StudioAdminProps, "id" | "isActive" | "createdAt">
  ): StudioAdminEntity {
    if (!props.email.includes("@")) throw new BadRequestError("Invalid email", "INVALID_EMAIL");

    return new StudioAdminEntity({
      ...props,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date(),
    });
  }

  public update(name?: string, passwordHash?: string): void {
    if (name) this.props.name = name;
    // Password hashing should be done securely before passing to entity
    if (passwordHash) this.props.passwordHash = passwordHash;
  }

  public toPrimitives(): StudioAdminProps {
    return { ...this.props };
  }
}
