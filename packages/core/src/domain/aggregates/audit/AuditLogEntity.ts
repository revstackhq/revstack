import { Entity } from "@/domain/base/Entity";

export interface AuditLogProps {
  id?: string;
  environmentId: string;
  actorId: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class AuditLogEntity extends Entity<AuditLogProps> {
  public static restore(props: AuditLogProps): AuditLogEntity {
    return new AuditLogEntity(props);
  }

  public static create(
    props: Omit<AuditLogProps, "id" | "createdAt">,
  ): AuditLogEntity {
    return new AuditLogEntity({
      ...props,
      createdAt: new Date(),
    });
  }
}
