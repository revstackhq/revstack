import { z } from "zod";

export const installIntegrationSchema = z.object({
  providerId: z.string(),
  config: z.record(z.any()),
});

export type InstallIntegrationCommand = z.infer<typeof installIntegrationSchema>;
