export type Customer = {
  /** revstack customer id. */
  id: string;
  /** provider slug (e.g. "stripe") */
  providerId: string;
  /** external customer id. */
  externalId: string;
  /** customer email */
  email: string;
  /** customer full name */
  name?: string;
  /** customer phone */
  phone?: string;
  /** custom metadata */
  metadata?: Record<string, any>;
  /** created at iso */
  createdAt: Date;
  /** deleted flag */
  deleted?: boolean;
};
