import { Customer } from "@revstackhq/providers-core";
import { Customer as PolarCustomer } from "@polar-sh/sdk/models/components/customer.js";

export function mapPolarCustomerToCustomer(customer: PolarCustomer): Customer {
  return {
    id: customer.id,
    providerId: "polar",
    externalId: customer.externalId || customer.id,
    email: customer.email,
    name: customer.name ?? undefined,
    metadata: customer.metadata,
    createdAt: new Date(customer.createdAt),
    deleted: false,
  };
}
