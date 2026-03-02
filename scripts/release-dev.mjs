/**
 * @file handles the local publication of Revstack packages using yalc.
 * Recursively finds all packages and pushes them to the local yalc store.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const PACKAGES_DIR = "packages";

/**
 * Recursively finds all directories containing a package.json file.
 * @param {string} dir - The directory to start the search from.
 * @param {string[]} packageList - Accumulator for package paths.
 * @returns {string[]} List of paths containing package.json.
 */
function findPackages(dir, packageList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    // Skip node_modules and hidden folders
    if (file === "node_modules" || file.startsWith(".")) continue;

    if (fs.statSync(fullPath).isDirectory()) {
      if (fs.existsSync(path.join(fullPath, "package.json"))) {
        packageList.push(fullPath);
      } else {
        findPackages(fullPath, packageList);
      }
    }
  }
  return packageList;
}

function runLocalPush() {
  console.log("Starting Revstack local push (yalc)...");

  try {
    // 1. Build everything first
    console.log("Compiling monorepo with Turbo...");
    execSync("pnpm turbo build", { stdio: "inherit" });

    // 2. Find and Publish each package
    const packagePaths = findPackages(PACKAGES_DIR);

    packagePaths.forEach((pkgPath) => {
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8"),
      );

      // Skip the root workspace if it's accidentally caught
      if (pkgJson.name === "revstack-os") return;

      console.log(`Pushing ${pkgJson.name} to yalc...`);

      /**
       * --push: automatically updates projects using this package
       * --sig: adds a signature to ensure the update is detected
       * --private: forces publishing even if "private": true is set
       */
      execSync("yalc publish --push --sig --private", {
        cwd: pkgPath,
        stdio: "inherit",
      });
    });

    console.log("Success! All packages found and pushed to yalc.");
  } catch (error) {
    console.error("Local push failed:", error.message);
  }
}

runLocalPush();
