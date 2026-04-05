import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants/index";

// --- Invoice Events ---

interface InvoiceCreatedEventPayload {
  id: string;
  customerId: string;
  environmentId: string;
  occurredAt: Date;
}

export class InvoiceCreatedEvent extends DomainEvent<InvoiceCreatedEventPayload> {
  public readonly eventName = DOMAIN_EVENTS.INVOICE_CREATED;

  constructor(payload: InvoiceCreatedEventPayload) {
    super(payload);
  }
}

// --- Invoice Line Item Events ---

interface InvoiceLineItemCreatedEventPayload {
  id: string;
  invoiceId: string;
  occurredAt: Date;
}

export class InvoiceLineItemCreatedEvent extends DomainEvent<InvoiceLineItemCreatedEventPayload> {
  public readonly eventName = DOMAIN_EVENTS.INVOICE_LINE_CREATED;

  constructor(payload: InvoiceLineItemCreatedEventPayload) {
    super(payload);
  }
}

export class InvoiceFinalizedEvent {
  constructor(public readonly invoiceId: string, public readonly customerId: string, public readonly occurredAt: Date = new Date()) {}
}

export class InvoiceVoidedEvent {
  constructor(public readonly invoiceId: string, public readonly customerId: string, public readonly occurredAt: Date = new Date()) {}
}

