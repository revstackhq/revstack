import { z } from "zod";

export const updateIntegrationConfigSchema = z.object({
  config: z.record(z.any()),
});

export type UpdateIntegrationConfigCommand = {
  id: string;
} & z.infer<typeof updateIntegrationConfigSchema>;
