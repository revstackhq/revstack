import {
  ProviderContext,
  AsyncActionResult,
  IngestEventInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import type { EventCreateCustomer } from "@polar-sh/sdk/models/components/eventcreatecustomer";

export async function ingestEvent(
  ctx: ProviderContext,
  input: IngestEventInput,
): Promise<AsyncActionResult<void>> {
  try {
    const polar = getOrCreateClient(ctx);

    const event: EventCreateCustomer = {
      name: input.eventName,
      customerId: input.customerId,
      metadata: {
        value: input.value,
      },
      ...(input.timestamp ? { timestamp: input.timestamp } : {}),
      ...(input.idempotencyKey ? { externalId: input.idempotencyKey } : {}),
    };

    await polar.events.ingest({ events: [event] });

    return {
      data: undefined as any,
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.UnknownError,
        message: `Failed to ingest event: ${error.message ?? error}`,
        providerError: JSON.stringify(error),
      },
    };
  }
}
