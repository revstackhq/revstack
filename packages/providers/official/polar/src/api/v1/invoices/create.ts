import {
  ProviderContext,
  CreateInvoiceInput,
  AsyncActionResult,
  CollectionMethod,
} from "@revstackhq/providers-core";
import Polar from "polar";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

function mapCollectionMethod(
  method: CollectionMethod,
): Polar.InvoiceCreateParams.CollectionMethod {
  return method === "manual" ? "send_invoice" : "charge_automatically";
}

export async function createInvoice(
  ctx: ProviderContext,
  input: CreateInvoiceInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    const polarCollectionMethod = mapCollectionMethod(input.collectionMethod);

    const params: Polar.InvoiceCreateParams = {
      customer: input.customerId,
      subscription: input.subscriptionId,
      auto_advance: input.autoAdvance,
      collection_method: polarCollectionMethod,
      description: input.description,
      metadata: {
        ...input.metadata,
        revstack_trace_id: ctx.traceId ?? null,
      },
    };

    if (polarCollectionMethod === "send_invoice") {
      params.days_until_due = input.daysUntilDue ?? 30;
    }

    const invoice = await polar.invoices.create(params, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: invoice.id, status: "success" };
  } catch (error: any) {
    return { data: null, status: "failed", error: mapError(error) };
  }
}
