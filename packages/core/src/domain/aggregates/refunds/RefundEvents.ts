import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants";

export interface RefundCreatedPayload {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export class RefundCreatedEvent extends DomainEvent<RefundCreatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.REFUND_CREATED;

  constructor(payload: RefundCreatedPayload) {
    super(payload);
  }
}

export interface RefundSucceededPayload {
  id: string;
  paymentId: string;
}

export class RefundSucceededEvent extends DomainEvent<RefundSucceededPayload> {
  public readonly eventName = DOMAIN_EVENTS.REFUND_SUCCEEDED;

  constructor(payload: RefundSucceededPayload) {
    super(payload);
  }
}

export interface RefundFailedPayload {
  id: string;
  paymentId: string;
  reason: string;
}

export class RefundFailedEvent extends DomainEvent<RefundFailedPayload> {
  public readonly eventName = DOMAIN_EVENTS.REFUND_FAILED;

  constructor(payload: RefundFailedPayload) {
    super(payload);
  }
}
