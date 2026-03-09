import type { SmokeReport } from "@/smoke-runner";

/**
 * Generates a formatted certification report from a SmokeReport.
 * Outputs both a human-readable console table and a structured JSON blob
 * suitable for CI artifact upload.
 */
export function generateCertificationReport(report: SmokeReport): {
  /** Structured JSON for CI artifact upload or badge generation */
  json: CertificationReport;
  /** Formatted multi-line string for console output */
  text: string;
} {
  const json = buildJson(report);
  const text = buildText(json);
  return { json, text };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CertificationReport {
  provider: string;
  version: string;
  ranAt: string;
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  durationMs: number;
  certification: "PRODUCTION_READY" | "PARTIAL" | "FAILED";
  scenarios: Array<{
    name: string;
    status: "passed" | "failed" | "skipped";
    durationMs: number;
    error?: string;
  }>;
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function buildJson(report: SmokeReport): CertificationReport {
  return {
    provider: report.provider,
    version: report.version,
    ranAt: report.ranAt,
    passed: report.passed,
    failed: report.failed,
    skipped: report.skipped,
    total: report.totalScenarios,
    durationMs: report.totalDurationMs,
    certification: report.certification,
    scenarios: report.scenarios.map((s) => ({
      name: s.name,
      status: s.status,
      durationMs: s.durationMs,
      error: s.error,
    })),
  };
}

function buildText(report: CertificationReport): string {
  const certColor =
    report.certification === "PRODUCTION_READY"
      ? "\x1b[32m"
      : report.certification === "PARTIAL"
        ? "\x1b[33m"
        : "\x1b[31m";
  const reset = "\x1b[0m";

  const header = [
    "╔══════════════════════════════════════════╗",
    `║  ${report.provider} — Certification Report`.padEnd(43) + "║",
    "╠══════════════════════════════════════════╣",
    `║  Date:    ${report.ranAt.slice(0, 19)}Z`.padEnd(43) + "║",
    `║  Version: ${report.version}`.padEnd(43) + "║",
    `║  Passed:  ${report.passed}/${report.total}`.padEnd(43) + "║",
    `║  Failed:  ${report.failed}`.padEnd(43) + "║",
    `║  Time:    ${report.durationMs}ms`.padEnd(43) + "║",
    "╠══════════════════════════════════════════╣",
    `║  ${certColor}${report.certification}${reset}`.padEnd(52) + "║",
    "╚══════════════════════════════════════════╝",
  ].join("\n");

  const failedRows = report.scenarios
    .filter((s) => s.status === "failed")
    .map((s) => `  ❌ ${s.name}: ${s.error ?? "unknown error"}`)
    .join("\n");

  return failedRows ? `${header}\n\nFailed Scenarios:\n${failedRows}` : header;
}
