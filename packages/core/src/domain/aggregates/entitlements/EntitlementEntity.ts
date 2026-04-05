import { Entity } from "@/domain/base/Entity";

export interface EntitlementProps {
  id?: string;
  name: string;
  slug: string;
  environmentId: string;
  description?: string;
  type: "boolean" | "metered" | "static" | "json";
  unitType: "count" | "bytes" | "seconds" | "tokens" | "requests" | "custom";
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class EntitlementEntity extends Entity<EntitlementProps> {
  private constructor(props: EntitlementProps) {
    super(props);
  }

  public static restore(props: EntitlementProps): EntitlementEntity {
    return new EntitlementEntity(props);
  }

  public static create(
    props: Omit<EntitlementProps, "id" | "createdAt">,
  ): EntitlementEntity {
    return new EntitlementEntity({
      ...props,
      metadata: props.metadata || {},
      createdAt: new Date(),
    });
  }
}
