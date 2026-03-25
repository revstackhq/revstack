import { z } from "zod";

export const listEnvironmentsSchema = z.object({
  projectId: z.string().optional(),
});

export type ListEnvironmentsQuery = z.infer<typeof listEnvironmentsSchema>;
