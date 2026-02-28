#!/usr/bin/env node
/**
 * Build Worker Bundle — Creates self-contained worker JS files.
 *
 * Bundles: SES + acorn + sandbox + transform + worker-entry
 * into single files ready for deployment.
 *
 * Usage:
 *   node scripts/build-worker.mjs          # Both ESM + IIFE (default)
 *   node scripts/build-worker.mjs --esm    # ESM only
 *   node scripts/build-worker.mjs --iife   # IIFE only
 *
 * Output:
 *   dist/runtime/worker-bundle.js      — ESM  (use: new Worker(url, { type: 'module' }))
 *   dist/runtime/worker-bundle.iife.js — IIFE (use: new Worker(url))
 */

import { build } from "esbuild";
import { resolve, relative, dirname } from "node:path";
import { statSync, mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENTRY = resolve(ROOT, "src/runtime/worker-bundle-entry.ts");
const OUT_DIR = resolve(ROOT, "dist/runtime");

const args = process.argv.slice(2);
const esmOnly = args.includes("--esm");
const iifeOnly = args.includes("--iife");
const formats = [];

if (!esmOnly && !iifeOnly) {
  formats.push(
    { format: "esm", suffix: "", note: "new Worker(url, { type: 'module' })" },
    { format: "iife", suffix: ".iife", note: "new Worker(url)" }
  );
} else {
  if (esmOnly) formats.push({ format: "esm", suffix: "", note: "new Worker(url, { type: 'module' })" });
  if (iifeOnly) formats.push({ format: "iife", suffix: ".iife", note: "new Worker(url)" });
}

async function buildFormat(fmt) {
  const outfile = resolve(OUT_DIR, `worker-bundle${fmt.suffix}.js`);

  const result = await build({
    entryPoints: [ENTRY],
    bundle: true,
    format: fmt.format,
    outfile,
    target: "es2022",
    platform: "browser",
    sourcemap: true,
    minify: false,
    legalComments: "none",
    logLevel: "warning",
    external: [],
    banner: {
      js: [
        `/* Worker Bundle — Black Box Scripter v0.5.0 */`,
        `/* Includes: SES (Hardened JavaScript), acorn, astring */`,
        `/* Load with: ${fmt.note} */`,
        ``,
      ].join("\n"),
    },
  });

  const bundleSize = statSync(outfile).size;
  const mapSize = statSync(`${outfile}.map`).size;

  console.log(`  ${fmt.format.toUpperCase().padEnd(5)} ${relative(ROOT, outfile)}`);
  console.log(`        ${(bundleSize / 1024).toFixed(1)} KB bundle, ${(mapSize / 1024).toFixed(1)} KB map`);

  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("Building worker bundles...\n");

  for (const fmt of formats) {
    await buildFormat(fmt);
  }

  // Copy ESM bundle to public/ for Vite dev server + editor build
  const publicRuntime = resolve(ROOT, "public/runtime");
  mkdirSync(publicRuntime, { recursive: true });
  const esmBundle = resolve(OUT_DIR, "worker-bundle.js");
  copyFileSync(esmBundle, resolve(publicRuntime, "worker-bundle.js"));
  console.log(`\n  Copied ESM bundle to public/runtime/ for Vite`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
