import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

// --- Plan Events ---

export class PlanCreatedEvent {
  constructor(public readonly planId: string, public readonly occurredAt: Date = new Date()) {}
}

// --- Plan Entitlement Events ---

export interface PlanEntitlementCreatedPayload {
  id: string;
  planId: string;
  entitlementId: string;
  limit: number;
  metadata: Record<string, unknown>;
}

export class PlanEntitlementCreatedEvent extends DomainEvent<PlanEntitlementCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.PLAN_ENTITLEMENT_CREATED;

  constructor(payload: PlanEntitlementCreatedPayload) {
    super(payload);
  }
}
