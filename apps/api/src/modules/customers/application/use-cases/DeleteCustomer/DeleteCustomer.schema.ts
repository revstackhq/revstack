import { z } from "zod";

export const DeleteCustomerCommandSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  environment_id: z.string().min(1, "Environment ID is required"),
});

export type DeleteCustomerCommand = z.infer<typeof DeleteCustomerCommandSchema>;

export const DeleteCustomerResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteCustomerResponse = z.infer<typeof DeleteCustomerResponseSchema>;
