import { Entity } from "@/domain/base/Entity";
import { BadRequestError } from "@/domain/base/DomainError";
import { generateId } from "@/utils";

export interface WorkspaceMemberProps {
  id: string;
  environmentId: string;
  email: string;
  passwordHash: string;
  name?: string;
  role: "owner" | "admin" | "viewer";
  isActive: boolean;
  createdAt: Date;
}

export class WorkspaceMemberEntity extends Entity<WorkspaceMemberProps> {
  private constructor(props: WorkspaceMemberProps) {
    super(props);
  }

  public static restore(props: WorkspaceMemberProps): WorkspaceMemberEntity {
    return new WorkspaceMemberEntity(props);
  }

  public static create(
    props: Omit<
      WorkspaceMemberProps,
      "id" | "isActive" | "createdAt" | "role"
    > & { role?: "owner" | "admin" | "viewer" },
  ): WorkspaceMemberEntity {
    if (!props.email.includes("@"))
      throw new BadRequestError("Invalid email", "INVALID_EMAIL");

    return new WorkspaceMemberEntity({
      ...props,
      id: generateId("mem"),
      role: props.role ?? "admin",
      isActive: true,
      createdAt: new Date(),
    });
  }

  public update(name?: string, passwordHash?: string): void {
    if (name) this.props.name = name;
    if (passwordHash) this.props.passwordHash = passwordHash;
  }
}
