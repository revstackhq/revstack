import { z } from "zod";

export const updateEnvironmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateEnvironmentCommand = {
  environmentId: string;
} & z.infer<typeof updateEnvironmentSchema>;
