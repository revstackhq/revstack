import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toCustomerPayload } from "@/api/v1/customers/mapper";
import type Stripe from "stripe";

/** Handles a customer creation event. → CUSTOMER_CREATED */
export function handleCustomerCreated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CustomerCreatedEvent;
  const customer = event.data.object;
  const data = toCustomerPayload(customer);

  return {
    type: "CUSTOMER_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: customer.id,
    customerId: customer.id,
    metadata: { ...customer.metadata },
    originalPayload: raw,
    data,
  };
}
