import { toMandatePayload } from "@/api/v1/mandates/mapper";
import type Stripe from "stripe";
import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";

/**
 * Handles a mandate status change event.
 * Routes to MANDATE_CREATED when the mandate becomes active,
 * or MANDATE_REVOKED when it becomes inactive or pending.
 */
export function handleMandateUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.MandateUpdatedEvent;
  const mandate = event.data.object;

  const isActive = mandate.status === "active";
  const type: RevstackEvent["type"] = isActive
    ? "MANDATE_CREATED"
    : "MANDATE_REVOKED";

  const data = toMandatePayload(mandate);

  return {
    type,
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: mandate.id,
    metadata: {},
    originalPayload: raw,
    data,
  };
}
