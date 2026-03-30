import { z } from "zod";

export const ListAddonsQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  is_archived: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type ListAddonsQuery = z.infer<typeof ListAddonsQuerySchema>;

export const AddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.string(),
  is_archived: z.boolean(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ListAddonsResponseSchema = z.array(AddonResponseSchema);

export type ListAddonsResponse = z.infer<typeof ListAddonsResponseSchema>;
