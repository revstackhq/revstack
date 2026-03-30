import { z } from "zod";

export const createPriceSchema = z.object({
  environmentId: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().int().min(0),
  currency: z.string().length(3).toLowerCase(),
  interval: z.enum(["month", "year", "week", "day"]).optional(),
  type: z.enum(["recurring", "one_time"]),
  planId: z.string().optional(),
  addonId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreatePriceCommand = z.infer<typeof createPriceSchema>;
