import { z } from "zod";

export const listAddonsSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  isArchived: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

export type ListAddonsQuery = z.infer<typeof listAddonsSchema>;
