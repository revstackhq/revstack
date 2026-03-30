import { z } from "zod";

export const DeleteEntitlementCommandSchema = z.object({
  id: z.string().min(1),
});

export type DeleteEntitlementCommand = z.infer<typeof DeleteEntitlementCommandSchema>;
