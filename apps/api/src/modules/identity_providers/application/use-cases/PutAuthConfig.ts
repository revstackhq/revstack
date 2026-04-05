import { z } from "zod";
import type { AuthConfigRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AuthConfigEntity } from "@revstackhq/core";
import { AuthConfigUpdatedEvent } from "@revstackhq/core";

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

export class PutAuthConfigHandler {
  constructor(
    private readonly repository: AuthConfigRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: PutAuthConfigCommand) {
    // Determine if config already exists for environment to treat this as an UPSERT
    const existingConfigs = await this.repository.findByEnvironmentId(command.environmentId);
    let config = existingConfigs[0];

    if (config) {
      config.update(command);
    } else {
      config = AuthConfigEntity.create(command);
    }

    await this.repository.save(config);

    await this.eventBus.publish(new AuthConfigUpdatedEvent(config.id, config.environmentId));

    return config.val;
  }
}
