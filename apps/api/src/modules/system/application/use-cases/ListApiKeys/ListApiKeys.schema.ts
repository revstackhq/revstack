import { z } from "zod";

export const listApiKeysSchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  type: z.enum(["public", "secret"]).optional(),
});

export type ListApiKeysQuery = z.infer<typeof listApiKeysSchema>;
