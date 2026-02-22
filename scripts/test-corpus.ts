#!/usr/bin/env npx tsx
/**
 * Corpus Transpilation Test — Mass-transpile all .lsl files in a directory.
 *
 * Runs every .lsl file through the transpiler and reports success/failure stats.
 * Useful for stress-testing the parser and codegen against real-world scripts.
 *
 * Usage:
 *   npx tsx scripts/test-corpus.ts [directory]
 *
 * Default directory: tests/fixtures/lsl/outworldz/
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve, join, relative } from "node:path";
import { transpile } from "../src/transpiler/transpile.js";

const ROOT = resolve(import.meta.dirname, "..");
const corpusDir = process.argv[2]
  ? resolve(process.argv[2])
  : join(ROOT, "tests/fixtures/lsl/outworldz");

interface FailureRecord {
  file: string;
  error: string;
  line?: number;
  column?: number;
}

// ── Collect all .lsl files ──────────────────────────────────

function findLslFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(d: string) {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (/\.lsl$/i.test(entry)) {
        files.push(full);
      }
    }
  }

  walk(dir);
  return files;
}

// ── Main ────────────────────────────────────────────────────

const lslFiles = findLslFiles(corpusDir);
console.log(`Found ${lslFiles.length} .lsl files in ${relative(ROOT, corpusDir)}`);

let success = 0;
let fail = 0;
let skipped = 0;
const skippedReasons = new Map<string, number>();
const failures: FailureRecord[] = [];
const errorPatterns = new Map<string, number>();

for (const file of lslFiles) {
  let source = readFileSync(file, "utf-8");
  const relPath = relative(corpusDir, file);

  // Strip OutWorldz metadata header (// :CATEGORY: ... // :CODE:)
  // The actual LSL code starts after the "// :CODE:" marker line.
  source = stripOutWorldzHeader(source);

  // Skip files that aren't LSL (PHP, VBScript, configs, notecards, etc.)
  const nonLSLReason = detectNonLSL(source);
  if (nonLSLReason) {
    skipped++;
    skippedReasons.set(nonLSLReason, (skippedReasons.get(nonLSLReason) ?? 0) + 1);
    continue;
  }

  try {
    const result = transpile(source, { filename: relPath });

    if (result.success) {
      success++;
    } else {
      fail++;
      for (const d of result.diagnostics) {
        const pattern = extractPattern(d.message);
        errorPatterns.set(pattern, (errorPatterns.get(pattern) ?? 0) + 1);
        failures.push({
          file: relPath,
          error: d.message,
        });
      }
    }
  } catch (err) {
    fail++;
    const msg = err instanceof Error ? err.message : String(err);
    const pattern = extractPattern(msg);
    errorPatterns.set(pattern, (errorPatterns.get(pattern) ?? 0) + 1);
    failures.push({ file: relPath, error: msg });
  }
}

// ── Report ──────────────────────────────────────────────────

const total = success + fail;
const rate = total > 0 ? ((success / total) * 100).toFixed(1) : "0";

console.log(`\n${"═".repeat(60)}`);
console.log(`  CORPUS TRANSPILATION RESULTS`);
console.log(`${"═".repeat(60)}`);
console.log(`  Total:    ${total} LSL scripts (${skipped} non-LSL skipped)`);
console.log(`  Success:  ${success} (${rate}%)`);
console.log(`  Failed:   ${fail}`);
console.log(`${"═".repeat(60)}`);

if (skipped > 0) {
  console.log(`\nSkipped non-LSL files:`);
  const sortedSkip = [...skippedReasons.entries()].sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of sortedSkip) {
    console.log(`  ${String(count).padStart(4)} × ${reason}`);
  }
}

if (failures.length > 0) {
  console.log(`\nError pattern summary (top 15):`);
  const sorted = [...errorPatterns.entries()].sort((a, b) => b[1] - a[1]);
  for (const [pattern, count] of sorted.slice(0, 15)) {
    console.log(`  ${String(count).padStart(4)} × ${pattern}`);
  }

  // Write detailed failures to file
  const reportPath = join(ROOT, "tests/fixtures/lsl/outworldz/.corpus-report.json");
  writeFileSync(
    reportPath,
    JSON.stringify({ total, success, fail, skipped, rate: `${rate}%`, failures }, null, 2)
  );
  console.log(`\nDetailed report: ${relative(ROOT, reportPath)}`);
}

process.exitCode = fail > 0 ? 1 : 0;

// ── Helpers ─────────────────────────────────────────────────

function extractPattern(msg: string): string {
  // Normalize error messages by removing line/col numbers
  return msg.replace(/\[\d+:\d+\]\s*/, "").replace(/"[^"]*"/g, '"..."');
}

/**
 * Strip OutWorldz site metadata header from script content.
 *
 * OutWorldz scripts have a header format:
 *   // :CATEGORY:Animal
 *   // :NAME:ScriptName
 *   // :DESCRIPTION:
 *   // ... description text (sometimes missing // prefix) ...
 *   // :CODE:
 *   <actual LSL code starts here>
 *
 * Some files have non-code text between :DESCRIPTION: and :CODE: that
 * lost its "//" comment prefix, causing parse errors.
 */
function stripOutWorldzHeader(source: string): string {
  const marker = "// :CODE:";
  const idx = source.indexOf(marker);
  if (idx === -1) return source;

  // Skip past the marker line (OutWorldz uses \r\r\n double-CR line endings)
  let start = idx + marker.length;
  while (source[start] === "\r" || source[start] === "\n") start++;
  let code = source.slice(start);

  // Strip leading numeric artifacts from OutWorldz export.
  // Database row numbers leak into export as: "1// comment...", "1\r\n", "123// ..."
  // May be preceded by blank lines.
  code = code.replace(/^[\r\n]+/, "");
  code = code.replace(/^\d+\s*(?=\/\/|[\r\n]|$)/, "");

  // Strip leading non-LSL text lines after the header.
  // Some files have warnings, URLs, or documentation text between :CODE: and actual code.
  // Use a negative match — only skip lines that are CLEARLY not LSL.
  const nonCodeLine = /^(?:FOR\s+DEBUG|https?:|www\.|Rev\s|Image\s|slide\d|stealth\b|[A-Z][A-Z]+[.:])/i;
  const lines = code.split(/\r?\n/);
  let firstCodeLine = 0;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line === "") continue; // skip blank lines
    if (nonCodeLine.test(line)) {
      firstCodeLine = i + 1; // skip this line, keep looking
      continue;
    }
    break; // first non-blank, non-junk line — this is code
  }
  if (firstCodeLine > 0) {
    code = lines.slice(firstCodeLine).join("\n");
  }

  return code;
}

/**
 * Detect files that are clearly not LSL (PHP, VBScript, configs, notecards, HTML).
 * Returns a descriptive reason string if non-LSL, or null if it looks like LSL.
 */
function detectNonLSL(source: string): string | null {
  const trimmed = source.trim();
  if (!trimmed) return "empty file";

  // PHP files
  if (trimmed.startsWith("<?")) return "PHP";

  // Shell scripts
  if (trimmed.startsWith("#!")) return "shell script";

  // Config/INI files (# comment at top, not LSL)
  if (trimmed.startsWith("# ") || trimmed.startsWith("#\t")) return "config file";

  // VBScript (starts with ' comment) — after smart quote normalization
  if (trimmed.startsWith("' ") || trimmed.startsWith("'\r") || trimmed.startsWith("'\n")) return "VBScript";

  // HTML/XML
  if (trimmed.startsWith("<html") || trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<HTML")) return "HTML";

  // Plain text files — no LSL state declaration anywhere
  if (!trimmed.includes("default") && !trimmed.includes("state_entry")) return "no LSL state found";

  return null;
}
