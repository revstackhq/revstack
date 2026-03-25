import { z } from "zod";

export const createUserSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  email: z.string().email("Invalid email"),
  name: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  metadata: z.record(z.any()).optional(),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;
