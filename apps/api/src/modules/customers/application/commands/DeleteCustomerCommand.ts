import { z } from "zod";

export const deleteCustomerCommandSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  environmentId: z.string().min(1, "Environment ID is required"),
});

export type DeleteCustomerCommand = z.infer<typeof deleteCustomerCommandSchema>;
