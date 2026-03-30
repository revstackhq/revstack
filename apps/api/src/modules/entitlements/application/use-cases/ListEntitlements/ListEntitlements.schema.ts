import { z } from "zod";

export const ListEntitlementsQuerySchema = z.object({
  environment_id: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type ListEntitlementsQuery = z.infer<typeof ListEntitlementsQuerySchema>;
