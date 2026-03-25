import { z } from "zod";

export const updateApiKeySchema = z.object({
  name: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type UpdateApiKeyCommand = {
  keyId: string;
} & z.infer<typeof updateApiKeySchema>;
