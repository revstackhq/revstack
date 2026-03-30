import { z } from "zod";

export const deleteApiKeyCommandSchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
});

export type DeleteApiKeyCommand = z.infer<typeof deleteApiKeyCommandSchema>;
