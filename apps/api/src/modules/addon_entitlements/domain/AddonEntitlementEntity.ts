import { Entity } from "@/common/domain/Entity";
import { BadRequestError } from "@/common/errors/DomainError";
import {
  AddonEntitlementCreatedEvent,
  AddonEntitlementDeletedEvent,
} from "@/modules/addon_entitlements/domain/events/AddonEntitlementEvents";

export interface AddonEntitlementProps {
  id?: string;
  addonId: string;
  entitlementId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class AddonEntitlementEntity extends Entity<AddonEntitlementProps> {
  private constructor(props: AddonEntitlementProps) {
    super(props);
  }

  public static restore(props: AddonEntitlementProps): AddonEntitlementEntity {
    return new AddonEntitlementEntity(props);
  }

  public static create(
    props: Omit<AddonEntitlementProps, "id" | "createdAt" | "updatedAt">,
  ): AddonEntitlementEntity {
    if (!props.addonId || !props.entitlementId) {
      throw new BadRequestError(
        "Both addonId and entitlementId are required",
        "MISSING_IDS",
      );
    }

    const entity = new AddonEntitlementEntity({
      ...props,
      metadata: props.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    entity.addEvent(
      new AddonEntitlementCreatedEvent({
        addon_id: props.addonId,
        entitlement_id: props.entitlementId,
      }),
    );

    return entity;
  }

  public markDeleted(): void {
    this.addEvent(
      new AddonEntitlementDeletedEvent({
        id: this.val.id!,
        addon_id: this.val.addonId,
      }),
    );
  }
}
