import { ProviderContext } from "@/context";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  Customer,
  GetCustomerInput,
  DeleteCustomerInput,
  ListCustomersOptions,
} from "@/types/customers";
import { AsyncActionResult, PaginatedResult } from "@/types/shared";

/**
 * Interface for Customer Management.
 * Syncs user identities between Revstack and the Payment Provider.
 */
export interface ICustomerFeature {
  /**
   * Creates a customer profile in the provider's system.
   * This allows attaching payment methods and subscriptions to a user.
   *
   * @param ctx - The execution context.
   * @param input - Email, Name, Phone, and Address.
   */
  createCustomer(
    ctx: ProviderContext,
    input: CreateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Updates an existing customer's details (e.g., changing email or address).
   *
   * @param ctx - The execution context.
   * @param id - The Provider's Customer ID (e.g., `cus_123`).
   * @param input - The fields to update.
   */
  updateCustomer(
    ctx: ProviderContext,
    input: UpdateCustomerInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Deletes (or archives) a customer in the provider's system.
   * Note: Some providers only support soft-deletes.
   *
   * @param ctx - The execution context.
   * @param id - The Provider's Customer ID.
   */
  deleteCustomer(
    ctx: ProviderContext,
    input: DeleteCustomerInput,
  ): Promise<AsyncActionResult<boolean>>;

  /**
   * Retrieves customer details.
   *
   * @param ctx - The execution context.
   * @param id - The Provider's Customer ID.
   */
  getCustomer(
    ctx: ProviderContext,
    input: GetCustomerInput,
  ): Promise<AsyncActionResult<Customer>>;

  /**
   * Lists customers with pagination.
   */
  listCustomers?(
    ctx: ProviderContext,
    options: ListCustomersOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Customer>>>;
}
