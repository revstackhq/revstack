import { z } from "zod";

export const createEnvironmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  projectId: z.string().min(1, "Project ID is required"),
});

export type CreateEnvironmentCommand = z.infer<typeof createEnvironmentSchema>;
