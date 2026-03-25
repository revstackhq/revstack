import { z } from "zod";

export const createProviderEventSchema = z.object({
  providerId: z.string(),
  externalEventId: z.string(),
  eventType: z.string(),
  payload: z.record(z.any()),
});

export type CreateProviderEventCommand = z.infer<typeof createProviderEventSchema>;
