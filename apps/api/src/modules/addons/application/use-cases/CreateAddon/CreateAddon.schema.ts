import { z } from "zod";

export const CreateAddonCommandSchema = z.object({
  environment_id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["flat", "metered"]),
  metadata: z.record(z.any()).optional(),
});

export type CreateAddonCommand = z.infer<typeof CreateAddonCommandSchema>;

export const CreateAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.string(),
  is_archived: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type CreateAddonResponse = z.infer<typeof CreateAddonResponseSchema>;
