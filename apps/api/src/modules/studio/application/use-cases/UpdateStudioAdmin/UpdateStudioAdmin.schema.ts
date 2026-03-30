import { z } from "zod";

export const updateStudioAdminSchema = z.object({
  name: z.string().optional(),
  passwordHash: z.string().optional(),
});

export type UpdateStudioAdminCommand = {
  adminId: string;
} & z.infer<typeof updateStudioAdminSchema>;
