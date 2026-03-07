import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import { toCustomerPayload } from "@/api/v1/customers/mapper";
import type Stripe from "stripe";

/** Handles a customer update event. → CUSTOMER_UPDATED */
export function handleCustomerUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.CustomerUpdatedEvent;
  const customer = event.data.object;
  const data = toCustomerPayload(customer);

  return {
    type: "CUSTOMER_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: customer.id,
    customerId: customer.id,
    metadata: { ...customer.metadata },
    originalPayload: raw,
    data,
  };
}
