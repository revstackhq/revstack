import { z } from "zod";

export const listEntitlementsSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListEntitlementsQuery = z.infer<typeof listEntitlementsSchema>;
