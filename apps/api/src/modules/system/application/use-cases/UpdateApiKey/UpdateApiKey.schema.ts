import { z } from "zod";

export const updateApiKeySchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
  name: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type UpdateApiKeyCommand = z.infer<typeof updateApiKeySchema>;
