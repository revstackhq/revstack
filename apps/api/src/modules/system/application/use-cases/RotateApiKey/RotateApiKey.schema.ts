import { z } from "zod";

export const rotateApiKeyCommandSchema = z.object({
  id: z.string(),
  environment_id: z.string().min(1, "Environment is required"),
  actor_id: z.string(),
});

export type RotateApiKeyCommand = z.infer<typeof rotateApiKeyCommandSchema>;
