export type Address = {
  /** address line 1 */
  line1: string;
  /** address line 2 */
  line2?: string;
  /** city */
  city: string;
  /** state */
  state?: string;
  /** postal code */
  postalCode: string;
  /** iso country code */
  country: string; // ISO 3166-1 alpha-2
};

export type ActionStatus = "success" | "pending" | "requires_action" | "failed";

export type ProrationBehavior =
  /** Do not prorate. The user loses the remaining time on their old plan. */
  | "none"
  /** Calculate the difference and charge/credit the user on their next regular cycle. (Stripe's 'create_prorations') */
  | "deferred"
  /** Calculate the difference and bill the customer immediately for the upgrade. (Stripe's 'always_invoice') */
  | "immediate";

export type Interval = "day" | "week" | "month" | "year";

export type PricingType = "one_time" | "recurring";

export type NextActionType = "redirect" | "url_load" | "show_modal";

export type AsyncActionResult<T> = {
  /** result data payload */
  data: T | null;
  /** action status */
  status: ActionStatus;
  /** next action required */
  nextAction?: {
    /** next action type */
    type: NextActionType;
    /** action url */
    url?: string;
    /** provider payload */
    payload?: any;
  };
  /** error information */
  error?: {
    /** stable error code */
    code: string;
    /** Human-readable error message. */
    message: string;
    /** provider specific error details */
    providerError?: string;
  };
};

export type PaginationOptions = {
  /** The maximum number of items to return. */
  limit?: number;

  /** The reference ID (cursor) to start fetching from. */
  cursor?: string;
  /** The direction to paginate relative to the cursor. Defaults to "forward". */
  direction?: "forward" | "backward";

  /** The explicit page number to fetch. (Overrides cursor if provided). */
  page?: number;
};

export type PaginatedResult<T> = {
  /** page items */
  data: T[];
  /** has more flag */
  hasMore: boolean;
  /** next page cursor */
  nextCursor?: string;
  /** has previous flag */
  hasPrevious?: boolean;
  /** previous page cursor */
  previousCursor?: string;
};
