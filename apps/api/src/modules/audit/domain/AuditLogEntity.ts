export interface AuditLogProps {
  id: string;
  environmentId: string;
  actorId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class AuditLogEntity {
  private constructor(private readonly props: AuditLogProps) {}

  get id() { return this.props.id; }
  get environmentId() { return this.props.environmentId; }
  get actorId() { return this.props.actorId; }
  get action() { return this.props.action; }
  get resource() { return this.props.resource; }
  get resourceId() { return this.props.resourceId; }
  get metadata() { return this.props.metadata; }
  get createdAt() { return this.props.createdAt; }

  public static restore(props: AuditLogProps): AuditLogEntity {
    return new AuditLogEntity(props);
  }

  // Entities themselves might not handle log creation directly if it's pushed through the AuditLogger abstraction
  // But for structural completeness:
  public static create(
    props: Omit<AuditLogProps, "id" | "createdAt">
  ): AuditLogEntity {
    return new AuditLogEntity({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  public toPrimitives(): AuditLogProps {
    return { ...this.props };
  }
}
