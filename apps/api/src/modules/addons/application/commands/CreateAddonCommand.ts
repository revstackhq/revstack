import { z } from "zod";

export const addonBaseSchema = z.object({
  environmentId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["flat", "metered"]),
  metadata: z.record(z.any()).optional(),
});

export const createAddonSchema = addonBaseSchema;
export type CreateAddonCommand = z.infer<typeof createAddonSchema>;
