import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface AddonEntitlementCreatedPayload {
  addon_id: string;
  entitlement_id: string;
}

export class AddonEntitlementCreatedEvent extends DomainEvent<AddonEntitlementCreatedPayload> {
  public readonly eventName = "addon_entitlement.created";
  constructor(payload: AddonEntitlementCreatedPayload) {
    super(payload);
  }
}

export interface AddonEntitlementDeletedPayload {
  id: string;
  addon_id: string;
}

export class AddonEntitlementDeletedEvent extends DomainEvent<AddonEntitlementDeletedPayload> {
  public readonly eventName = "addon_entitlement.deleted";
  constructor(payload: AddonEntitlementDeletedPayload) {
    super(payload);
  }
}
