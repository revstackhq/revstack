import { BadRequestError } from "@/common/errors/DomainError";

export interface AddonEntitlementProps {
  id: string;
  addonId: string;
  entitlementId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class AddonEntitlementEntity {
  private constructor(private readonly props: AddonEntitlementProps) {}

  get id() { return this.props.id; }
  get addonId() { return this.props.addonId; }
  get entitlementId() { return this.props.entitlementId; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: AddonEntitlementProps): AddonEntitlementEntity {
    return new AddonEntitlementEntity(props);
  }

  public static create(
    props: Omit<AddonEntitlementProps, "id" | "createdAt" | "updatedAt">
  ): AddonEntitlementEntity {
    if (!props.addonId || !props.entitlementId) {
      throw new BadRequestError("Both addonId and entitlementId are required");
    }

    return new AddonEntitlementEntity({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public toPrimitives(): AddonEntitlementProps {
    return { ...this.props };
  }
}
