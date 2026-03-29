import { z } from "zod";

export const customerResponseSchema = z.object({
  id: z.string(),
  environmentId: z.string(),
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  externalId: z.string(),
  phone: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
});

export type CustomerResponseDTO = z.infer<typeof customerResponseSchema>;
