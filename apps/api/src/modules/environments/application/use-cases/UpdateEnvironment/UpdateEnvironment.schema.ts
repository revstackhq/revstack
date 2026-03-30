import { z } from "zod";

export const UpdateEnvironmentCommandSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
});

export type UpdateEnvironmentCommand = z.infer<
  typeof UpdateEnvironmentCommandSchema
>;
