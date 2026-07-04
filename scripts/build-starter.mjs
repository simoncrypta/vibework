#!/usr/bin/env node
/**
 * Build the public template branch from main by stripping maintainer-only files.
 *
 * Usage (on main, clean working tree):
 *   node scripts/build-starter.mjs
 *   node scripts/build-starter.mjs --dry-run
 *
 * Publishes to branch `starter` (force-push). Set that branch as the GitHub
 * default so "Use this template" omits maintainer tooling.
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dirname, "..");
const STARTER_BRANCH = "starter";
const MARKER_START = "<!-- MAINTAINER:START -->";
const MARKER_END = "<!-- MAINTAINER:END -->";

function usage() {
  console.error(`Usage: node scripts/build-starter.mjs [--dry-run]

Builds branch "${STARTER_BRANCH}" from the current commit with maintainer
files removed (see MAINTAINER_STRIP.json).
`);
  process.exit(1);
}

function run(cmd, args, options = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", cwd: ROOT, ...options });
}

function runShell(command) {
  return execSync(command, { encoding: "utf8", cwd: ROOT, stdio: "pipe" });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function stripMarkers(content) {
  const pattern = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}\\n?`, "g");
  return content.replace(pattern, "");
}

function applyStrip(targetDir, config, dryRun) {
  const removed = [];
  const patched = [];

  for (const relativePath of config.remove ?? []) {
    const filePath = path.join(targetDir, relativePath);
    if (!fs.existsSync(filePath)) continue;
    if (!dryRun) fs.unlinkSync(filePath);
    removed.push(relativePath);
  }

  for (const relativePath of config.stripMarkers ?? []) {
    const filePath = path.join(targetDir, relativePath);
    if (!fs.existsSync(filePath)) continue;
    const next = stripMarkers(fs.readFileSync(filePath, "utf8"));
    const prev = fs.readFileSync(filePath, "utf8");
    if (next === prev) continue;
    if (!dryRun) fs.writeFileSync(filePath, next);
    patched.push(relativePath);
  }

  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath) && config.removePackageScripts?.length) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    let changed = false;
    for (const scriptName of config.removePackageScripts) {
      if (pkg.scripts?.[scriptName]) {
        delete pkg.scripts[scriptName];
        changed = true;
      }
    }
    if (changed) {
      if (!dryRun) {
        fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
      }
      patched.push("package.json");
    }
  }

  return { removed, patched };
}

function assertCleanMain() {
  const branch = run("git", ["branch", "--show-current"]).trim();
  if (branch !== "master" && branch !== "main") {
    console.error(`error: run from main/master (current: ${branch})`);
    process.exit(1);
  }

  const status = run("git", ["status", "--porcelain"]).trim();
  if (status) {
    console.error("error: working tree must be clean before building starter");
    process.exit(1);
  }
}

function extractTree(commit, targetDir) {
  runShell(`git archive "${commit}" | tar -x -C "${targetDir}"`);
}

function publishStarter(targetDir, dryRun) {
  const message = `starter: template branch from ${run("git", ["rev-parse", "--short", "HEAD"]).trim()}`;

  if (dryRun) {
    console.log(`Would force-push branch "${STARTER_BRANCH}" with message:`);
    console.log(`  ${message}`);
    return;
  }

  const previousBranch = run("git", ["branch", "--show-current"]).trim();
  try {
    try {
      run("git", ["rev-parse", "--verify", STARTER_BRANCH]);
      run("git", ["branch", "-D", STARTER_BRANCH]);
    } catch {
      // branch does not exist locally
    }

    run("git", ["checkout", "--orphan", STARTER_BRANCH]);

    const entries = fs.readdirSync(ROOT);
    for (const entry of entries) {
      if (entry === ".git") continue;
      runShell(`rm -rf "${path.join(ROOT, entry)}"`);
    }

    runShell(`cp -a "${targetDir}/." "${ROOT}/"`);

    run("git", ["add", "-A"]);
    run("git", ["commit", "-m", message]);
    run("git", ["push", "--force", "origin", STARTER_BRANCH]);
  } finally {
    run("git", ["checkout", previousBranch]);
    runShell(`git clean -fd`);
  }
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (process.argv.some((arg) => arg === "--help" || arg === "-h")) usage();

  assertCleanMain();

  const configPath = path.join(ROOT, "MAINTAINER_STRIP.json");
  if (!fs.existsSync(configPath)) {
    console.error("error: MAINTAINER_STRIP.json not found");
    process.exit(1);
  }

  const config = readJson("MAINTAINER_STRIP.json");
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vibework-starter-"));

  try {
    const commit = run("git", ["rev-parse", "HEAD"]).trim();
    extractTree(commit, tmpDir);
    const { removed, patched } = applyStrip(tmpDir, config, dryRun);

    console.log(`Build ${STARTER_BRANCH} from ${commit}${dryRun ? " (dry-run)" : ""}`);
    console.log("");

    if (removed.length > 0) {
      console.log(`Remove (${removed.length}):`);
      for (const file of removed) console.log(`  - ${file}`);
      console.log("");
    }

    if (patched.length > 0) {
      console.log(`Patch (${patched.length}):`);
      for (const file of patched) console.log(`  ~ ${file}`);
      console.log("");
    }

    publishStarter(tmpDir, dryRun);

    if (!dryRun) {
      console.log(`Published "${STARTER_BRANCH}". Set it as the default branch on GitHub.`);
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main();
