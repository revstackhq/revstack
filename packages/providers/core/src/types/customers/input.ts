import { Address } from "@/types/shared";
import { PaginationOptions } from "@/types/shared";

export type CreateCustomerInput = {
  /** customer email */
  email: string;
  /** customer full name */
  name?: string;
  /** customer phone */
  phone?: string;
  /** optional description */
  description?: string;
  /** billing address */
  address?: Address;
  /** custom metadata */
  metadata?: Record<string, any>;
};

export type UpdateCustomerInput = Partial<CreateCustomerInput> & {
  id: string;
};

export type GetCustomerInput = { id: string };

export type DeleteCustomerInput = { id: string };

export interface ListCustomersOptions extends PaginationOptions {
  filters?: Record<string, any>;
}
