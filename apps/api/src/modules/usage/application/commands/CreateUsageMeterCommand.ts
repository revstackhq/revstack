import { z } from "zod";

export const createUsageMeterSchema = z.object({
  customerId: z.string().min(1),
  featureId: z.string().min(1),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
});

export type CreateUsageMeterCommand = z.infer<typeof createUsageMeterSchema>;
