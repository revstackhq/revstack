import {
  AsyncActionResult,
  CreateCustomerInput,
  Customer,
  ProviderContext,
  UpdateCustomerInput,
  PaginatedResult,
  PaginationOptions,
  buildPagePagination,
} from "@revstackhq/providers-core";
import { getOrCreatePolar } from "@/api/v1/client";
import { mapPolarCustomerToCustomer } from "@/api/v1/mappers";
import { mapError } from "@/shared/error-map";

/**
 * Creates a new customer in Polar.
 *
 * @param ctx - The provider context.
 * @param input - Customer input payload.
 * @returns The created customer ID.
 */
export const createCustomer = async (
  ctx: ProviderContext,
  input: CreateCustomerInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreatePolar(ctx.config.accessToken);
    const customer = await polar.customers.create({
      email: input.email,
      name: input.name || undefined,
      metadata: input.metadata || {},
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
};

/**
 * Updates an existing Polar customer by ID.
 *
 * @param ctx - The provider context.
 * @param customerId - The ID of the customer to update.
 * @param input - The update payload.
 * @returns The updated customer ID.
 */
export const updateCustomer = async (
  ctx: ProviderContext,
  customerId: string,
  input: UpdateCustomerInput,
): Promise<AsyncActionResult<string>> => {
  try {
    const polar = getOrCreatePolar(ctx.config.accessToken);
    const customer = await polar.customers.update({
      id: customerId,
      customerUpdate: {
        email: input.email,
        name: input.name || undefined,
        metadata: input.metadata || {},
      },
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
};

/**
 * Deletes a customer permanently from Polar.
 *
 * @param ctx - The provider context.
 * @param customerId - The customer ID to delete.
 * @returns A boolean indicating success.
 */
export const deleteCustomer = async (
  ctx: ProviderContext,
  customerId: string,
): Promise<AsyncActionResult<boolean>> => {
  try {
    const polar = getOrCreatePolar(ctx.config.accessToken);
    await polar.customers.delete({
      id: customerId,
    });

    return {
      data: true,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: false, status: "failed", error: error.errorPayload };
    }
    return { data: false, status: "failed", error: mapError(error) };
  }
};

/**
 * Retrieves a customer profile from Polar by ID.
 *
 * @param ctx - The provider context.
 * @param customerId - The customer ID to fetch.
 * @returns The mapped customer object.
 */
export const getCustomer = async (
  ctx: ProviderContext,
  customerId: string,
): Promise<AsyncActionResult<Customer>> => {
  try {
    const polar = getOrCreatePolar(ctx.config.accessToken);
    const customer = await polar.customers.get({
      id: customerId,
    });

    return {
      data: mapPolarCustomerToCustomer(customer),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};

/**
 * Lists out and paginates Polar customers.
 *
 * @param ctx - The provider context.
 * @param options - Pagination options.
 * @param filters - Optional query filters.
 * @returns A paginated response of matched customers.
 */
export const listCustomers = async (
  ctx: ProviderContext,
  options?: PaginationOptions & { email?: string },
  filters?: Record<string, any>,
): Promise<AsyncActionResult<PaginatedResult<Customer>>> => {
  try {
    const polar = getOrCreatePolar(ctx.config.accessToken);
    const targetPage =
      options?.page ||
      (options?.startingAfter && parseInt(options.startingAfter) + 1) ||
      (options?.endingBefore &&
        Math.max(1, parseInt(options.endingBefore) - 1)) ||
      1;
    const limit = options?.limit || 10;

    const customersPage = await polar.customers.list({
      limit,
      page: targetPage,
      email: options?.email,
      ...filters,
    });

    return {
      data: buildPagePagination(
        customersPage.result.items,
        targetPage,
        customersPage.result.pagination.maxPage,
        mapPolarCustomerToCustomer,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
};
