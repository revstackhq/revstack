import { z } from "zod";

export const listIntegrationsSchema = z.object({
  status: z.enum(["installed", "uninstalled", "error"]).optional(),
  providerId: z.string().optional(),
});

export type ListIntegrationsQuery = z.infer<typeof listIntegrationsSchema>;
