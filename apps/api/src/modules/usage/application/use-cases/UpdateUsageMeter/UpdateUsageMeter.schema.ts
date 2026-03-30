import { z } from "zod";

export const updateUsageMeterSchema = z.object({
  periodStart: z.string().datetime().optional(),
  periodEnd: z.string().datetime().optional(),
});

export type UpdateUsageMeterCommand = {
  id: string;
} & z.infer<typeof updateUsageMeterSchema>;
