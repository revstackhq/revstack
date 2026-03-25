import { z } from "zod";

export const listPricesSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  planId: z.string().optional(),
  addonId: z.string().optional(),
  isArchived: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

export type ListPricesQuery = z.infer<typeof listPricesSchema>;
