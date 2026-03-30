import { z } from "zod";

export const createApiKeySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["public", "secret"]),
  scopes: z.array(z.string()).default([]),
});

export type CreateApiKeyCommand = z.infer<typeof createApiKeySchema>;
