import { z } from "zod";

export const CreateEnvironmentCommandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  is_default: z.boolean().default(false),
  project_id: z.string().optional(),
});

export type CreateEnvironmentCommand = z.infer<
  typeof CreateEnvironmentCommandSchema
>;
