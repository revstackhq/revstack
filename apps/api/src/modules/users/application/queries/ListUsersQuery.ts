import { z } from "zod";

export const listUsersSchema = z.object({
  environmentId: z.string().optional(),
  role: z.string().optional(),
  isActive: z.enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>;
