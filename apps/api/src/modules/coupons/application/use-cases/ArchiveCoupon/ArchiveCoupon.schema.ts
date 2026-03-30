import { z } from "zod";

export const ArchiveCouponCommandSchema = z.object({
  id: z.string().min(1),
});

export type ArchiveCouponCommand = z.infer<typeof ArchiveCouponCommandSchema>;
