import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [provider, method = "all"] = process.argv.slice(2);

if (!provider) {
  console.error("❌ Usage: pnpm smoke <provider> [method|all]");
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
const candidates = [
  path.join(root, "packages/providers/official", provider),
  path.join(root, "packages/providers/community", provider),
];

const pkgDir = candidates.find((p) =>
  fs.existsSync(path.join(p, "package.json")),
);

if (!pkgDir) {
  console.error(`❌ Provider '${provider}' not found.`);
  process.exit(1);
}

console.log(`\n📦 Provider: ${provider.toUpperCase()}`);
console.log(
  `🛠  Scenario: ${method === "all" ? "FULL AUTOMATED SUITE" : method}`,
);
console.log(`───────────────────────────────────────────────────\n`);

try {
  execSync(`pnpm -C "${pkgDir}" run dev:smoke ${method}`, {
    stdio: "inherit",
    env: { ...process.env },
  });

  console.log(`\n✅ Smoke test finished successfully.\n`);
} catch (e) {
  process.exit(1);
}
