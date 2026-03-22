import { z } from "zod";

export const createWebhookEndpointSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  events: z.array(z.string()).min(1, "At least one event is required"),
});

export type CreateWebhookEndpointCommand = z.infer<typeof createWebhookEndpointSchema>;
