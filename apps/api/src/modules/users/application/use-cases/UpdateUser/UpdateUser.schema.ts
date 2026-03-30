import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateUserCommand = {
  userId: string;
} & z.infer<typeof updateUserSchema>;
