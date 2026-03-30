import { z } from "zod";

export const GetEnvironmentQuerySchema = z.object({
  id: z.string(),
});

export type GetEnvironmentQuery = z.infer<typeof GetEnvironmentQuerySchema>;

export const GetEnvironmentResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  is_default: z.boolean(),
  project_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetEnvironmentResponse = z.infer<
  typeof GetEnvironmentResponseSchema
>;
