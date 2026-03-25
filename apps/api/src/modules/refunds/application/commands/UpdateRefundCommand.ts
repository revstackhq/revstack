import { z } from "zod";

export const updateRefundSchema = z.object({
  status: z.enum(["pending", "succeeded", "failed"]),
});

export type UpdateRefundCommand = {
  id: string;
} & z.infer<typeof updateRefundSchema>;
