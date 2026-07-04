#!/usr/bin/env node
/**
 * Copy generic files from vibework (core) into a design-system variant repo.
 *
 * Reads paths from CORE_MANIFEST.json and skips anything listed in the
 * variant's VARIANT_OWNED.json.
 *
 * Usage (from vibework repo):
 *   node scripts/sync-to-variant.mjs ../vibework-astryx
 *   node scripts/sync-to-variant.mjs ../vibework-astryx --ref v0.1.0
 *   node scripts/sync-to-variant.mjs ../vibework-astryx --dry-run
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Usage: node scripts/sync-to-variant.mjs <variant-dir> [options]

Options:
  --ref <git-ref>   Core commit/tag to sync from (default: HEAD)
  --source <dir>    Core repo root (default: parent of scripts/)
  --dry-run         Report changes without writing files
`);
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  let ref = "HEAD";
  let source = path.resolve(dirname, "..");
  let dryRun = false;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--ref") {
      ref = argv[++i];
      if (!ref) usage();
      continue;
    }
    if (arg === "--source") {
      source = path.resolve(argv[++i] ?? "");
      if (!source) usage();
      continue;
    }
    if (arg.startsWith("-")) usage();
    positional.push(arg);
  }

  if (positional.length !== 1) usage();

  return {
    target: path.resolve(positional[0]),
    ref,
    source,
    dryRun,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readFromGit(sourceRoot, ref, relativePath) {
  try {
    return execFileSync("git", ["-C", sourceRoot, "show", `${ref}:${relativePath}`], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function readCoreFile(sourceRoot, ref, relativePath) {
  if (ref === "HEAD" && !process.env.VIBEWORK_SYNC_FORCE_GIT) {
    const diskPath = path.join(sourceRoot, relativePath);
    if (fs.existsSync(diskPath)) {
      return fs.readFileSync(diskPath, "utf8");
    }
  }

  const fromGit = readFromGit(sourceRoot, ref, relativePath);
  if (fromGit !== null) return fromGit;

  const diskPath = path.join(sourceRoot, relativePath);
  if (fs.existsSync(diskPath)) {
    return fs.readFileSync(diskPath, "utf8");
  }

  return null;
}

function posixRelative(filePath) {
  return filePath.split(path.sep).join("/");
}

function matchesGlob(relativePath, glob) {
  const normalized = posixRelative(relativePath);
  if (glob.endsWith("/**")) {
    const prefix = glob.slice(0, -3);
    return normalized === prefix || normalized.startsWith(`${prefix}/`);
  }
  if (glob.includes("*")) {
    const pattern = `^${glob
      .split("/")
      .map((part) => (part === "**" ? ".*" : part.replace(/\*/g, "[^/]*")))
      .join("/")}$`;
    return new RegExp(pattern).test(normalized);
  }
  return normalized === glob;
}

function isVariantOwned(relativePath, owned) {
  const normalized = posixRelative(relativePath);
  if (owned.paths?.includes(normalized)) return true;
  for (const glob of owned.globs ?? []) {
    if (matchesGlob(normalized, glob)) return true;
  }
  return false;
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const { target, ref, source, dryRun } = parseArgs(process.argv);

  if (!fs.existsSync(target)) {
    console.error(`error: variant directory not found: ${target}`);
    process.exit(1);
  }

  const manifestRaw = readCoreFile(source, ref, "CORE_MANIFEST.json");
  if (manifestRaw === null) {
    console.error(`error: CORE_MANIFEST.json not found in ${source} @ ${ref}`);
    process.exit(1);
  }

  const manifest = JSON.parse(manifestRaw);
  const ownedPath = path.join(target, "VARIANT_OWNED.json");
  const owned = fs.existsSync(ownedPath) ? readJson(ownedPath) : { paths: [], globs: [] };

  const copied = [];
  const unchanged = [];
  const skipped = [];
  const missing = [];
  const created = [];

  for (const relativePath of manifest.paths) {
    const normalized = posixRelative(relativePath);

    if (isVariantOwned(normalized, owned)) {
      skipped.push(normalized);
      continue;
    }

    const nextContent = readCoreFile(source, ref, normalized);
    if (nextContent === null) {
      missing.push(normalized);
      continue;
    }

    const targetPath = path.join(target, normalized);
    const hadFile = fs.existsSync(targetPath);
    const prevContent = hadFile ? fs.readFileSync(targetPath, "utf8") : null;

    if (prevContent === nextContent) {
      unchanged.push(normalized);
      continue;
    }

    if (dryRun) {
      copied.push(normalized);
      if (!hadFile) created.push(normalized);
      continue;
    }

    ensureParent(targetPath);
    fs.writeFileSync(targetPath, nextContent);
    copied.push(normalized);
    if (!hadFile) created.push(normalized);
  }

  const variantName = owned.variant ?? path.basename(target);
  console.log(`vibework sync → ${variantName}`);
  console.log(`  source: ${source} @ ${ref}`);
  console.log(`  target: ${target}`);
  if (dryRun) console.log("  mode:   dry-run (no files written)");
  console.log("");

  if (copied.length > 0) {
    console.log(`${dryRun ? "Would update" : "Updated"} (${copied.length}):`);
    for (const file of copied) console.log(`  ~ ${file}`);
    console.log("");
  }

  if (created.length > 0) {
    console.log(`${dryRun ? "Would create" : "Created"} (${created.length}):`);
    for (const file of created) console.log(`  + ${file}`);
    console.log("");
  }

  if (unchanged.length > 0) {
    console.log(`Unchanged (${unchanged.length})`);
  }

  if (skipped.length > 0) {
    console.log(`Skipped — variant-owned (${skipped.length})`);
  }

  if (missing.length > 0) {
    console.log("");
    console.error(`Missing in core (${missing.length}):`);
    for (const file of missing) console.error(`  ? ${file}`);
    process.exit(1);
  }

  if (copied.length === 0) {
    console.log("\nVariant is already up to date with core.");
  } else if (dryRun) {
    console.log("\nRe-run without --dry-run to apply changes.");
  } else {
    console.log("\nSync complete. Run vp check && vp test in the variant repo.");
  }
}

main();
