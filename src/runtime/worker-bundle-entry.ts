/**
 * Worker Bundle Entry — Self-contained worker with SES included.
 *
 * This is the build entry point for creating a single-file worker bundle
 * that includes all dependencies (SES lockdown, Compartment, acorn, etc.).
 *
 * Build:  npm run build:worker
 * Output: dist/runtime/worker-bundle.js
 *
 * Usage in host application:
 *   const adapter = new ScriptHostAdapter({
 *     workerUrl: '/path/to/worker-bundle.js'
 *   });
 *
 * Load as:
 *   new Worker('/path/to/worker-bundle.js', { type: 'module' })
 *
 * What's included:
 * - SES (lockdown, harden, Compartment) — sandbox security
 * - acorn + acorn-walk + astring — AST safety transforms
 * - sandbox.ts — SES initialization + compartment creation
 * - transform.ts — loop/recursion protection, global blocking
 * - worker-entry.ts — message handler, script lifecycle, API proxy
 */

// 1. Import SES — adds lockdown(), harden(), Compartment to globalThis
//    Must run before any other code to freeze intrinsics.
import "ses";

// 2. Import worker entry — sets up message handler, calls initializeSES()
//    This pulls in sandbox.ts + transform.ts + types.ts transitively.
import "./worker-entry.js";
