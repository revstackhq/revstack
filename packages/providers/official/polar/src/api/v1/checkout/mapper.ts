export function mapSessionToCheckoutResult(session: any) {
  return {
    id: session.id,
    expiresAt: session.expiresAt
      ? new Date(session.expiresAt).toISOString()
      : undefined,
  };
}
