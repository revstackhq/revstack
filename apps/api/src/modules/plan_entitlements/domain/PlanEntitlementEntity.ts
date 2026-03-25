import { BadRequestError } from "@/common/errors/DomainError";

export interface PlanEntitlementProps {
  id: string;
  planId: string;
  entitlementId: string;
  limit?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class PlanEntitlementEntity {
  private constructor(private readonly props: PlanEntitlementProps) {}

  get id() { return this.props.id; }
  get planId() { return this.props.planId; }
  get entitlementId() { return this.props.entitlementId; }
  get limit() { return this.props.limit; }
  get metadata() { return this.props.metadata || {}; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public static restore(props: PlanEntitlementProps): PlanEntitlementEntity {
    return new PlanEntitlementEntity(props);
  }

  public static create(
    props: Omit<PlanEntitlementProps, "id" | "createdAt" | "updatedAt">
  ): PlanEntitlementEntity {
    if (!props.planId || !props.entitlementId) {
      throw new BadRequestError("Both planId and entitlementId are required");
    }

    return new PlanEntitlementEntity({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateLimits(limit?: number): void {
    this.props.limit = limit;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): PlanEntitlementProps {
    return { ...this.props };
  }
}
