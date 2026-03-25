import { z } from "zod";

export const createStudioAdminSchema = z.object({
  email: z.string().email("Invalid email"),
  passwordHash: z.string().min(1, "Password hash required"),
  name: z.string().optional(),
  isSuperadmin: z.boolean().default(false),
});

export type CreateStudioAdminCommand = z.infer<typeof createStudioAdminSchema>;
