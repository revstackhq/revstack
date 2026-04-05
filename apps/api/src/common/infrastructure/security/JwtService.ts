import { verify } from "hono/jwt";

export interface JwtPayload {
  environmentId: string;
  scopes?: string[];
  sub?: string;
  exp?: number;
  iat?: number;
}

export class JwtService {
  constructor(private readonly secret: string) {}

  async verify(token: string): Promise<JwtPayload> {
    const payload = await verify(token, this.secret, "HS256");

    if (!payload.environmentId || typeof payload.environmentId !== "string") {
      throw new Error("JWT payload missing required 'environmentId' claim");
    }

    return {
      environmentId: payload.environmentId as string,
      scopes: Array.isArray(payload.scopes) ? (payload.scopes as string[]) : [],
      sub: payload.sub as string | undefined,
      exp: payload.exp as number | undefined,
      iat: payload.iat as number | undefined,
    };
  }
}
