import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  currency: z.string().length(3).optional(),
});

export type CreatePlanCommand = z.infer<typeof createPlanSchema>;
