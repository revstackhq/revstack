import {
  ProviderContext,
  AsyncActionResult,
  CreateMeterInput,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import type { MeterCreate } from "@polar-sh/sdk/models/components/metercreate";

export async function createMeter(
  ctx: ProviderContext,
  input: CreateMeterInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx);

    // Build the Polar aggregation from our agnostic type
    const aggregation = buildAggregation(input.aggregationType);

    const meterPayload: MeterCreate = {
      name: input.displayName ?? input.eventName,
      filter: {
        conjunction: "and",
        clauses: [
          {
            property: "name",
            operator: "eq",
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
        message: `Failed to create meter: ${error.message ?? error}`,
        providerError: JSON.stringify(error),
      },
    };
  }
}

/**
 * Maps our agnostic `MeterAggregationType` to Polar's aggregation union.
 *
 * - `"count"` → `{ func: "count" }` (CountAggregation)
 * - `"sum"` → `{ func: "sum", property: "value" }` (PropertyAggregation)
 * - `"max"` → `{ func: "max", property: "value" }` (PropertyAggregation)
 * - `"last"` → `{ func: "max", property: "value" }` (Polar has no "last",
 *    closest semantic is "max" — caller should be aware of this limitation)
 */
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
      // Polar doesn't have a native "last" aggregation.
      // We approximate with "max" — the caller should be aware.
      return { func: "max", property: "value" };
  }
}
