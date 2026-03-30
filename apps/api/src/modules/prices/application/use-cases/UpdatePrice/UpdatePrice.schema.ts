import { z } from "zod";

export const updatePriceSchema = z.object({
  name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdatePriceCommand = {
  priceId: string;
} & z.infer<typeof updatePriceSchema>;
