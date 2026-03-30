import { z } from "zod";

export const DeleteEnvironmentCommandSchema = z.object({
  id: z.string(),
});

export type DeleteEnvironmentCommand = z.infer<
  typeof DeleteEnvironmentCommandSchema
>;

export const DeleteEnvironmentResponseSchema = z.object({
  id: z.string(),
});

export type DeleteEnvironmentResponse = z.infer<
  typeof DeleteEnvironmentResponseSchema
>;
