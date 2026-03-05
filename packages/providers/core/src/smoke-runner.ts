import { ProviderContext } from "@/context";
import { IProvider } from "@/interfaces/provider";
import { ProviderManifest } from "@/manifest";

export interface SmokeConfig {
  provider: IProvider;
  ctx: ProviderContext;
  scenarios: Record<string, (ctx: ProviderContext) => Promise<any>>;
  manifest: ProviderManifest;
}

export async function runSmoke(config: SmokeConfig) {
  const method = process.argv[2] || "onInstall";

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
    return;
  }

  const scenario = config.scenarios[method];
  if (!scenario) {
    console.error(`❌ \x1b[31mError:\x1b[0m Scenario '${method}' not found.`);
    console.log(`   Run 'list' to see available scenarios.`);
    process.exit(1);
  }

  try {
    console.time("⏱️ Execution time");
    const result = await scenario(config.ctx);
    console.timeEnd("⏱️ Execution time");

    console.log("\n✅ \x1b[32mSUCCESS RESULT:\x1b[0m");
    console.dir(result, { depth: null, colors: true });
  } catch (e) {
    console.error("\n🔥 \x1b[31mFAILED:\x1b[0m");
    console.error(e);
    process.exit(1);
  }
}
