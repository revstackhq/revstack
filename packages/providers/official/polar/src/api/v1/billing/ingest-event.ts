import {
  ProviderContext,
  AsyncActionResult,
  IngestEventInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import type { EventCreateCustomer } from "@polar-sh/sdk/models/components/eventcreatecustomer";

/**
 * Streams a usage event to Polar.
 * * @remarks
 * Revstack utilizes a "Just-In-Time" (JIT) ingestion strategy for Polar.
 * Instead of streaming raw usage continuously, the Revstack Hub aggregates usage
 * internally and ONLY calls this function near the end of the billing cycle to
 * report billable overages.
 */
export async function ingestEvent(
  ctx: ProviderContext,
  input: IngestEventInput,
): Promise<AsyncActionResult<void>> {
  try {
    const polar = getOrCreateClient(ctx);

    const event: EventCreateCustomer = {
      name: input.eventName,
      customerId: input.customerId,
      // Polar expects numeric values to be passed inside the metadata object
      // so it can extract them using the PropertyAggregation clause.
      metadata: {
        value: input.value,
      },
      ...(input.timestamp ? { timestamp: input.timestamp } : {}),
      ...(input.idempotencyKey ? { externalId: input.idempotencyKey } : {}),
    };

    // Polar expects an object with an 'events' array wrapper
    await polar.events.ingest({ events: [event] });

    return {
      data: null,
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.UnknownError,
        message: `Polar: Failed to ingest JIT event: ${error.message ?? error}`,
        providerError: JSON.stringify(error),
      },
    };
  }
}
