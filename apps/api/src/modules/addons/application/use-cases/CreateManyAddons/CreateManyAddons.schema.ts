import { z } from "zod";
import { CreateAddonCommandSchema } from "../CreateAddon/CreateAddon.schema";

export const CreateManyAddonsCommandSchema = z.object({
  environment_id: z.string().min(1),
  addons: z.array(CreateAddonCommandSchema.omit({ environment_id: true })).min(1),
});

export type CreateManyAddonsCommand = z.infer<typeof CreateManyAddonsCommandSchema>;

export const CreateManyAddonsResponseSchema = z.array(z.any());

export type CreateManyAddonsResponse = z.infer<typeof CreateManyAddonsResponseSchema>;
