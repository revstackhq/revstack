import {
  ProviderContext,
  AsyncActionResult,
  CreateMeterInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import type { MeterCreate } from "@polar-sh/sdk/models/components/metercreate";

/**
 * Creates a Meter in Polar.
 * * @remarks
 * In the Revstack architecture, meters are typically created during product sync.
 * Polar tracks events by 'name', so we use the Revstack internal meter slug as the
 * exact event name to avoid cross-tenant collisions.
 */
export async function createMeter(
  ctx: ProviderContext,
  input: CreateMeterInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx);
    const aggregation = buildAggregation(input.aggregationType);

    const meterPayload: MeterCreate = {
      name: input.displayName ?? input.eventName,
      filter: {
        conjunction: "and",
        clauses: [
          {
            property: "name",
            operator: "eq",
            // We strictly map the Revstack event name to the Polar event name
            value: input.eventName,
          },
        ],
      },
      aggregation,
    };

    const meter = await polar.meters.create(meterPayload);

    return {
      data: meter.id,
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.UnknownError,
        message: `Polar: Failed to create meter: ${error.message ?? error}`,
        providerError: JSON.stringify(error),
      },
    };
  }
}

function buildAggregation(
  type: CreateMeterInput["aggregationType"],
): MeterCreate["aggregation"] {
  switch (type) {
    case "count":
      return { func: "count" };
    case "sum":
      return { func: "sum", property: "value" };
    case "max":
      return { func: "max", property: "value" };
    case "last":
      // WARNING: Polar lacks a native 'last' state tracking function.
      // Revstack mitigates this by pre-aggregating the state internally
      // and only submitting the final resolved value to Polar at the end of the cycle.
      return { func: "max", property: "value" };
  }
}
