import { z } from "zod";
import { addonBaseSchema } from "./CreateAddonCommand";

export const createManyAddonsSchema = z.object({
  addons: z.array(addonBaseSchema).min(1),
});

export type CreateManyAddonsCommand = z.infer<typeof createManyAddonsSchema>;
