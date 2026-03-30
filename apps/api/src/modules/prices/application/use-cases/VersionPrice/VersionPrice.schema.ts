import { z } from "zod";

export const versionPriceSchema = z.object({
  amount: z.number().int().min(0, "Amount must be positive"),
  currency: z.string().length(3).toLowerCase().optional(),
});

export type VersionPriceCommand = {
  priceId: string;
} & z.infer<typeof versionPriceSchema>;
