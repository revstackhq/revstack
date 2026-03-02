import {
  mapAddressToStripe,
  mapStripeCustomerToCustomer,
} from "@/api/v1/mappers";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  RevstackErrorCode,
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
  PaginationOptions,
  buildCursorPagination,
  AsyncActionResult,
  PaginatedResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Creates a new customer in Stripe.
 * Automatically maps the Revstack address format to Stripe's native address schema.
 * Injects the current Revstack trace ID into the customer's metadata to ensure
 * observability across distributed API calls.
 *
 * @param ctx - The core provider context containing configuration and execution traces.
 * @param input - The payload containing the customer's profile (email, name, phone, address).
 * @returns An AsyncActionResult successfully yielding the newly created Stripe Customer ID.
 */
export async function createCustomer(
  ctx: ProviderContext,
  input: CreateCustomerInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.create(
      {
        email: input.email,
        name: input.name,
        phone: input.phone,
        description: input.description,
        address: mapAddressToStripe(input.address),
        metadata: {
          ...input.metadata,
          revstack_trace_id: ctx.traceId || null,
        },
      },
      { idempotencyKey: ctx.idempotencyKey },
    );

    return {
      data: customer.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Updates an existing customer profile securely via Stripe's API by their primary ID.
 * Completely replaces core mapped properties including metadata without disrupting
 * underlying subscriptions or attached payment methods.
 *
 * @param ctx - The core provider context instance.
 * @param id - The active Stripe Customer ID identifier (e.g., 'cus_...').
 * @param input - The scoped input payload of modifications to apply to the customer record.
 * @returns An AsyncActionResult detailing the successfully assigned Stripe Customer ID.
 */
export async function updateCustomer(
  ctx: ProviderContext,
  id: string,
  input: UpdateCustomerInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.update(id, {
      email: input.email,
      name: input.name,
      phone: input.phone,
      description: input.description,
      address: mapAddressToStripe(input.address),
      metadata: input.metadata,
    });

    return {
      data: customer.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Permanently deletes a targeted customer entirely from the Stripe ecosystem.
 * WARNING: This destructive action irrevocably cancels all active subscriptions directly
 * tied to this customer within Stripe. Cannot be undone natively.
 *
 * @param ctx - The core provider context instance.
 * @param id - The exact Stripe Customer ID designated for permanent deletion.
 * @returns An AsyncActionResult dictating boolean `true` if uniquely removed successfully.
 */
export async function deleteCustomer(
  ctx: ProviderContext,
  id: string,
): Promise<AsyncActionResult<boolean>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const deleted = await stripe.customers.del(id);
    return {
      data: deleted.deleted,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: false, status: "failed", error: error.errorPayload };
    }
    return { data: false, status: "failed", error: mapError(error) };
  }
}

/**
 * Securely retrieves a full-fledged customer metadata object from Stripe using their ID.
 * Contains critical defensive checks: if Stripe natively returns a specialized deleted object
 * configuration, this explicitly traps it and throws a formalized ResourceNotFound standard error.
 *
 * @param ctx - The core provider context instance.
 * @param id - The Stripe Customer ID query target.
 * @returns An AsyncActionResult containing the definitively mapped Revstack Customer format.
 */
export async function getCustomer(
  ctx: ProviderContext,
  id: string,
): Promise<AsyncActionResult<Customer>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customer = await stripe.customers.retrieve(id);

    if (customer.deleted) {
      throw {
        isRevstackError: true,
        errorPayload: {
          code: RevstackErrorCode.ResourceNotFound,
          message: "Customer has been deleted in Stripe",
        },
      };
    }

    return {
      data: mapStripeCustomerToCustomer(customer),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Fetches natively paginated index lists of active customers inside Stripe.
 * Exploits structural bidirectional tracking capabilities by dynamically mapping generic Revstack
 * cursors securely against specific Stripe `starting_after`/`ending_before` mechanics.
 *
 * @param ctx - The core provider context instance.
 * @param pagination - Generic structural boundaries instructing depth limitation and cursor positions.
 * @param filters - Isolated key-map variables passed untouched into equivalent native Stripe search filters (e.x email query).
 * @returns An AsyncActionResult wrapping a bidirectional PaginatedResult of populated Stripe customers.
 */
export async function listCustomers(
  ctx: ProviderContext,
  pagination: PaginationOptions,
  filters?: Record<string, any>,
): Promise<AsyncActionResult<PaginatedResult<Customer>>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    const customers = await stripe.customers.list({
      limit: pagination.limit || 10,
      starting_after: pagination.startingAfter || undefined,
      ending_before: pagination.endingBefore || undefined,
      ...filters,
    });

    return {
      data: buildCursorPagination(
        customers.data,
        customers.has_more,
        pagination,
        mapStripeCustomerToCustomer,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
