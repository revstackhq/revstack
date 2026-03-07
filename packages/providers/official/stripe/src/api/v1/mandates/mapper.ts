import Stripe from "stripe";
import {
  MandateMapper,
  MandatePayload,
  MandateStatus,
  MandateType,
} from "@revstackhq/providers-core";

/**
 * Maps a raw provider mandate object into the unified Revstack Mandate entity.
 * Normalizes the operational status, authorization scope, and relational identifiers.
 *
 * @param raw - The raw mandate object from Stripe.
 * @returns A normalized Revstack Mandate.
 */
export const toMandate: MandateMapper = (raw) => {
  const mandate = raw as Stripe.Mandate;

  const statusMap: Record<string, MandateStatus> = {
    active: "active",
    inactive: "inactive",
    pending: "pending",
  };

  const typeMap: Record<string, MandateType> = {
    multi_use: "multi_use",
    single_use: "single_use",
  };

  const paymentMethodId =
    typeof mandate.payment_method === "string"
      ? mandate.payment_method
      : mandate.payment_method.id;

  return {
    id: mandate.id,
    providerId: "stripe",
    externalId: mandate.id,
    paymentMethodId,
    status: statusMap[mandate.status] ?? "inactive",
    type:
      typeMap[mandate.multi_use ? "multi_use" : "single_use"] ?? "single_use",
    createdAt: new Date(),
    metadata: {},
    raw: mandate,
  };
};

/**
 * Extracts a minimal MandatePayload from a raw provider mandate object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw mandate object from a webhook event body.
 * @returns A MandatePayload for use in RevstackEvent.data.
 */
export function toMandatePayload(raw: any): MandatePayload {
  const mandate = raw as Stripe.Mandate;
  const paymentMethodId =
    typeof mandate.payment_method === "string"
      ? mandate.payment_method
      : mandate.payment_method.id;
  const statusMap: Record<string, MandateStatus> = {
    active: "active",
    inactive: "inactive",
    pending: "pending",
  };

  return {
    paymentMethodId,
    status: statusMap[mandate.status] ?? "inactive",
    type: mandate.multi_use ? "multi_use" : "single_use",
  };
}
