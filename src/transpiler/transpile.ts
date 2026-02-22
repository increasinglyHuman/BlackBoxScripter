/**
 * LSL Transpiler — Main entry point.
 *
 * Wires lexer → parser → code generator into a single `transpile()` call.
 * Also re-exports individual pipeline stages for advanced use.
 */

import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import { generate } from "./codegen.js";
import type { TranspileOptions, TranspileResult } from "./types.js";

/**
 * Preprocess LSL source to handle common real-world artifacts:
 * - HTML entities from web-scraped scripts (&lt; → <, &gt; → >, etc.)
 * - Git merge conflict markers (<<<<<<< / ======= / >>>>>>>)
 * - Smart/curly quotes from word processors and web sources
 * - Registered trademark and other decorative Unicode symbols
 */
function preprocess(source: string): string {
  let s = source;

  // Strip BOM (byte order mark) — common in Windows-edited files
  if (s.charCodeAt(0) === 0xFEFF) {
    s = s.slice(1);
  }

  // Strip null bytes and zero-width characters that corrupt UTF-8 files
  // (BOM fragments, UTF-16 artifacts, zero-width spaces/joiners)
  // eslint-disable-next-line no-control-regex
  s = s.replace(/[\x00\uFFFD\u200B\u200C\u200D\uFEFF]/g, "");

  // Decode HTML entities (common in web-scraped scripts)
  if (s.includes("&lt;") || s.includes("&gt;") || s.includes("&amp;")) {
    s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  }

  // Strip git merge conflict markers (keep "ours" side)
  // Handle both \n and \r\n line endings
  if (s.includes("<<<<<<<")) {
    s = s.replace(/<{7}[^\r\n]*\r?\n([\s\S]*?)={7}\r?\n[\s\S]*?>{7}[^\r\n]*/g, "$1");
  }

  // Normalize smart/curly quotes → straight quotes
  // Common in scripts copy-pasted from Word, web forums, or rich text editors
  s = s.replace(/[\u2018\u2019\u201A\u2039\u203A]/g, "'");  // '' → '
  s = s.replace(/[\u201C\u201D\u201E\u00AB\u00BB]/g, '"');   // "" → "

  // Strip decorative Unicode symbols that sometimes appear in LSL comments
  // but cause lexer errors when they leak outside comments (®, ©, ™, etc.)
  s = s.replace(/[\u00AE\u00A9\u2122]/g, "");

  // Strip trailing backslash line continuations (C-style, not valid in LSL)
  s = s.replace(/\\\r?\n/g, "\n");

  return s;
}

/**
 * Transpile LSL source code to TypeScript.
 *
 * @param source   Raw LSL source text
 * @param options  Optional configuration (className, filename, etc.)
 * @returns        TranspileResult with generated code and diagnostics
 */
export function transpile(source: string, options?: TranspileOptions): TranspileResult {
  try {
    const ast = parse(preprocess(source));
    return generate(ast, options);
  } catch (err) {
    return {
      code: "",
      success: false,
      diagnostics: [
        {
          severity: "error",
          message: err instanceof Error ? err.message : String(err),
        },
      ],
      className: options?.className ?? "LSLScript",
    };
  }
}

// Re-export pipeline stages
export { tokenize } from "./lexer.js";
export { parse } from "./parser.js";
export { generate } from "./codegen.js";
export { TypeTracker } from "./type-tracker.js";
export { FunctionResolver } from "./function-resolver.js";
