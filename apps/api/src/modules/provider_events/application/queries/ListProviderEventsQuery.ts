import { z } from "zod";

export const listProviderEventsSchema = z.object({
  providerId: z.string().optional(),
  status: z.enum(["pending", "processed", "failed"]).optional(),
  eventType: z.string().optional(),
});

export type ListProviderEventsQuery = z.infer<typeof listProviderEventsSchema>;
