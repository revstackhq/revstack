import { describe, it, expect } from "vitest";
import { calculateProrationBreakdown } from "@/utils/finance";

describe("calculateProrationBreakdown", () => {
  /** * Simple mock structure to simulate provider line items.
   * In a real scenario, this would be Stripe.InvoiceLineItem or similar.
   */
  interface MockLine {
    id: string;
    amount: number;
    isAdjustment: boolean;
  }

  const getAmount = (line: MockLine) => line.amount;
  const checkIsProration = (line: MockLine) => line.isAdjustment;

  it("should return zero for both totals when lines are empty", () => {
    const result = calculateProrationBreakdown<MockLine>(
      [],
      checkIsProration,
      getAmount,
    );

    expect(result.immediateCharge).toBe(0);
    expect(result.recurringTotal).toBe(0);
  });

  it("should correctly identify only recurring items", () => {
    const lines: MockLine[] = [
      { id: "li_1", amount: 1000, isAdjustment: false },
      { id: "li_2", amount: 500, isAdjustment: false },
    ];

    const result = calculateProrationBreakdown(
      lines,
      checkIsProration,
      getAmount,
    );

    expect(result.immediateCharge).toBe(0);
    expect(result.recurringTotal).toBe(1500);
  });

  it("should correctly identify only proration items (Immediate Charges)", () => {
    const lines: MockLine[] = [
      { id: "li_1", amount: 200, isAdjustment: true },
      { id: "li_2", amount: 300, isAdjustment: true },
    ];

    const result = calculateProrationBreakdown(
      lines,
      checkIsProration,
      getAmount,
    );

    expect(result.immediateCharge).toBe(500);
    expect(result.recurringTotal).toBe(0);
  });

  it("should handle a complex Upgrade scenario (Credits + Debits)", () => {
    /**
     * Scenario: Customer upgrades mid-cycle.
     * - Prorated charge for the new high-tier plan: 5000
     * - Prorated credit for the unused time of the old plan: -2000
     * - New baseline monthly cost for the next cycle: 10000
     */
    const lines: MockLine[] = [
      { id: "new_plan_proration", amount: 5000, isAdjustment: true },
      { id: "old_plan_credit", amount: -2000, isAdjustment: true },
      { id: "future_recurring_bill", amount: 10000, isAdjustment: false },
    ];

    const result = calculateProrationBreakdown(
      lines,
      checkIsProration,
      getAmount,
    );

    // The net immediate charge should be 3000 (5000 - 2000)
    expect(result.immediateCharge).toBe(3000);
    // The new recurring total should be 10000
    expect(result.recurringTotal).toBe(10000);
  });

  it("should handle a Downgrade scenario resulting in a negative immediate charge", () => {
    /**
     * Scenario: Customer downgrades mid-cycle.
     * - Net credit due to tier drop: -1500
     * - New low-tier baseline monthly cost: 2000
     */
    const lines: MockLine[] = [
      { id: "downgrade_credit", amount: -1500, isAdjustment: true },
      { id: "future_low_tier_bill", amount: 2000, isAdjustment: false },
    ];

    const result = calculateProrationBreakdown(
      lines,
      checkIsProration,
      getAmount,
    );

    expect(result.immediateCharge).toBe(-1500);
    expect(result.recurringTotal).toBe(2000);
  });
});
