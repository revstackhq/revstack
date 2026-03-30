import { z } from "zod";

export const GetAddonQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetAddonQuery = z.infer<typeof GetAddonQuerySchema>;

export const GetAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.string(),
  is_archived: z.boolean(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetAddonResponse = z.infer<typeof GetAddonResponseSchema>;
