import { z } from "zod";

export const createApiKeySchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  name: z.string().min(1, "Name is required"),
});

export type CreateApiKeyCommand = z.infer<typeof createApiKeySchema>;
