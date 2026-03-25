import { z } from "zod";

export const createApiKeySchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["public", "secret"]),
  scopes: z.array(z.string()).default([]),
});

export type CreateApiKeyCommand = z.infer<typeof createApiKeySchema>;
