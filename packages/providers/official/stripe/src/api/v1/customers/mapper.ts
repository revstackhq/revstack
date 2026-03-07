import Stripe from "stripe";
import {
  CustomerMapper,
  CustomerPayload,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Maps a raw provider customer record into the unified Revstack Customer entity.
 * Handles soft-deleted customer stubs by returning a tombstone record
 * rather than throwing, allowing callers to perform graceful cleanup.
 *
 * @param raw - The raw provider customer object.
 * @returns A unified Revstack Customer entity.
 */
export const toCustomer: CustomerMapper = (raw) => {
  const rawObject = raw as Stripe.Customer | Stripe.DeletedCustomer;
  const cust = rawObject as Stripe.Customer | Stripe.DeletedCustomer;

  // A deleted customer stub indicates the record was permanently removed at the provider.
  // Return a minimal tombstone so downstream handlers can clean up local records.
  if (cust.deleted) {
    return {
      id: cust.id,
      providerId: "stripe",
      externalId: cust.id,
      email: "",
      createdAt: new Date(),
      metadata: { deleted: "true" },
      deleted: true,
    };
  }

  const c = cust as Stripe.Customer;

  return {
    id: c.id,
    providerId: "stripe",
    externalId: c.id,
    email: c.email || "",
    name: c.name || undefined,
    phone: c.phone || undefined,
    metadata: c.metadata,
    createdAt: fromUnixSeconds(c.created),
  };
};

/**
 * Extracts a minimal CustomerPayload from a raw provider customer object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw customer object from a webhook event body.
 * @returns A CustomerPayload for use in RevstackEvent.data.
 */
export function toCustomerPayload(raw: any): CustomerPayload {
  const cust = raw as Stripe.Customer;

  if (raw.deleted) {
    return {
      email: undefined,
      name: undefined,
      phone: undefined,
      delinquent: false,
    };
  }

  return {
    email: cust.email ?? undefined,
    name: cust.name ?? undefined,
    phone: cust.phone ?? undefined,
    delinquent: cust.delinquent ?? false,
  };
}
