import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";

export interface PlanEntitlementProps {
  id?: string;
  planId: string;
  entitlementId: string;
  limit?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class PlanEntitlementEntity extends Entity<PlanEntitlementProps> {
  private constructor(props: PlanEntitlementProps) {
    super(props);
  }

  public static restore(props: PlanEntitlementProps): PlanEntitlementEntity {
    return new PlanEntitlementEntity(props);
  }

  public static create(
    props: Omit<PlanEntitlementProps, "id" | "createdAt" | "updatedAt">,
  ): PlanEntitlementEntity {
    if (!props.planId || !props.entitlementId) {
      throw new BadRequestError("Both planId and entitlementId are required");
    }

    return new PlanEntitlementEntity({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateLimits(limit?: number): void {
    this.props.limit = limit;
    this.props.updatedAt = new Date();
  }
}
