import { z } from "zod";

export const putAuthConfigSchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  provider: z.enum(["clerk", "supabase", "firebase", "auth0", "custom"]),
  strategy: z.enum(["jwt", "jwks"]),
  jwksUri: z.string().url().optional(),
  signingSecret: z.string().optional(),
  issuer: z.string().optional(),
  audience: z.string().optional(),
  userIdClaim: z.string().min(1, "User ID claim is required"),
});

export type PutAuthConfigCommand = z.infer<typeof putAuthConfigSchema>;
