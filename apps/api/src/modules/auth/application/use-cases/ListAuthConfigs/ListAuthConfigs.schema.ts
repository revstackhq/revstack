import { z } from "zod";

export const listAuthConfigsSchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  status: z.enum(["active", "archived"]).optional(),
});

export type ListAuthConfigsQuery = z.infer<typeof listAuthConfigsSchema>;
