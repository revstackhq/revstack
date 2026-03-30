import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface StudioAdminProps {
  id?: string;
  email: string;
  passwordHash: string;
  name?: string;
  isSuperadmin: boolean;
  isActive: boolean;
  createdAt: Date;
}

export class StudioAdminEntity extends Entity<StudioAdminProps> {
  private constructor(props: StudioAdminProps) {
    super(props);
  }

  public static restore(props: StudioAdminProps): StudioAdminEntity {
    return new StudioAdminEntity(props);
  }

  public static create(
    props: Omit<StudioAdminProps, "id" | "isActive" | "createdAt">,
  ): StudioAdminEntity {
    if (!props.email.includes("@"))
      throw new BadRequestError("Invalid email", "INVALID_EMAIL");

    return new StudioAdminEntity({
      ...props,
      isActive: true,
      createdAt: new Date(),
    });
  }

  public update(name?: string, passwordHash?: string): void {
    if (name) this.props.name = name;
    if (passwordHash) this.props.passwordHash = passwordHash;
  }
}
