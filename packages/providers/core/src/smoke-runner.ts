import type { ProviderContext } from "@/context";
import type { IProvider } from "@/interfaces/provider";
import type { ProviderManifest } from "@/manifest";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SmokeConfig {
  provider: IProvider;
  ctx: ProviderContext;
  scenarios: Record<string, (ctx: ProviderContext) => Promise<any>>;
  manifest: ProviderManifest;
  /**
   * When false, the suite continues even after a scenario failure,
   * collecting all results before reporting. Defaults to true.
   */
  bail?: boolean;
}

export interface ScenarioResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  /** Execution time in milliseconds */
  durationMs: number;
  error?: string;
  data?: unknown;
}

export interface SmokeReport {
  provider: string;
  version: string;
  ranAt: string;
  mode: string;
  totalScenarios: number;
  passed: number;
  failed: number;
  skipped: number;
  totalDurationMs: number;
  scenarios: ScenarioResult[];
  certification: "PRODUCTION_READY" | "FAILED" | "PARTIAL";
}

// ─── Report Generation ────────────────────────────────────────────────────────

function buildReport(
  manifest: ProviderManifest,
  results: ScenarioResult[],
  mode: string,
): SmokeReport {
  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  const certification =
    failed === 0 && passed > 0
      ? "PRODUCTION_READY"
      : failed > 0 && passed > 0
        ? "PARTIAL"
        : "FAILED";

  return {
    provider: manifest.name,
    version: manifest.version ?? "unknown",
    ranAt: new Date().toISOString(),
    mode,
    totalScenarios: results.length,
    passed,
    failed,
    skipped,
    totalDurationMs,
    scenarios: results,
    certification,
  };
}

function printReport(report: SmokeReport): void {
  const certColor =
    report.certification === "PRODUCTION_READY"
      ? "\x1b[32m"
      : report.certification === "PARTIAL"
        ? "\x1b[33m"
        : "\x1b[31m";
  const reset = "\x1b[0m";

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log(`║  ${report.provider} — Smoke Report`.padEnd(47) + "║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║  Date:      ${report.ranAt}`.padEnd(47) + "║");
  console.log(`║  Version:   ${report.version}`.padEnd(47) + "║");
  console.log(
    `║  Total:     ${report.totalScenarios} scenarios`.padEnd(47) + "║",
  );
  console.log(`║  ✅ Passed:  ${report.passed}`.padEnd(47) + "║");
  console.log(`║  ❌ Failed:  ${report.failed}`.padEnd(47) + "║");
  console.log(`║  ⏭️  Skipped: ${report.skipped}`.padEnd(47) + "║");
  console.log(`║  Time:      ${report.totalDurationMs}ms`.padEnd(47) + "║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(
    `║  CERTIFICATION: ${certColor}${report.certification}${reset}`.padEnd(57) +
      "║",
  );
  console.log("╚══════════════════════════════════════════════╝\n");
}

// ─── Main Runner ──────────────────────────────────────────────────────────────

export async function runSmoke(config: SmokeConfig): Promise<SmokeReport> {
  const method = process.argv[2] || "all";
  const bail = config.bail ?? true;
  const providerName = config.manifest.name;

  console.log(`\n🚬 \x1b[36mSmoking Provider:\x1b[0m ${providerName}`);
  console.log(`👉 \x1b[33mMethod:\x1b[0m ${method}\n`);

  if (method === "list") {
    console.log("📋 Available scenarios:");
    console.log(
      Object.keys(config.scenarios)
        .map((k) => `  - ${k}`)
        .join("\n"),
    );
    return buildReport(config.manifest, [], method);
  }

  if (method === "all") {
    console.log("🏃 \x1b[35mRunning full automated suite...\x1b[0m");
    console.log("───────────────────────────────────");

    const results: ScenarioResult[] = [];
    const suiteStart = Date.now();

    for (const [name, scenario] of Object.entries(config.scenarios)) {
      process.stdout.write(`▶️  Scenario [\x1b[33m${name}\x1b[0m]: `);
      const start = Date.now();

      try {
        const data = await scenario(config.ctx);
        const durationMs = Date.now() - start;
        console.log(
          `\x1b[32m✅ PASSED\x1b[0m \x1b[90m(${durationMs}ms)\x1b[0m`,
        );
        results.push({ name, status: "passed", durationMs, data });
      } catch (e: any) {
        const durationMs = Date.now() - start;
        const errMsg = e?.message ?? String(e);
        console.log(
          `\x1b[31m❌ FAILED\x1b[0m \x1b[90m(${durationMs}ms)\x1b[0m`,
        );
        console.error(`   🔥 \x1b[31m${errMsg}\x1b[0m`);
        results.push({ name, status: "failed", durationMs, error: errMsg });

        if (bail) {
          console.log(
            "\n⚠️  Bailing after first failure. Use bail: false for full report.\n",
          );
          const report = buildReport(config.manifest, results, method);
          printReport(report);
          process.exit(1);
        }
      }
    }

    console.log("───────────────────────────────────");
    console.log(`\x1b[90mTotal time: ${Date.now() - suiteStart}ms\x1b[0m\n`);

    const report = buildReport(config.manifest, results, method);
    printReport(report);

    if (report.failed > 0) process.exit(1);
    return report;
  }

  // ─── Single scenario mode ──────────────────────────────────────────────────
  const scenario = config.scenarios[method];
  if (!scenario) {
    console.error(`❌ \x1b[31mError:\x1b[0m Scenario '${method}' not found.`);
    console.log(`   Run 'list' to see available scenarios.`);
    process.exit(1);
  }

  const start = Date.now();
  try {
    console.time("⏱️ Execution time");
    const result = await scenario(config.ctx);
    const durationMs = Date.now() - start;
    console.timeEnd("⏱️ Execution time");
    console.log("\n✅ \x1b[32mSUCCESS RESULT:\x1b[0m");
    console.dir(result, { depth: null, colors: true });

    return buildReport(
      config.manifest,
      [{ name: method, status: "passed", durationMs, data: result }],
      method,
    );
  } catch (e) {
    const durationMs = Date.now() - start;
    console.error("\n🔥 \x1b[31mFAILED:\x1b[0m");
    console.error(e);

    return buildReport(
      config.manifest,
      [{ name: method, status: "failed", durationMs, error: String(e) }],
      method,
    );
  }
}
