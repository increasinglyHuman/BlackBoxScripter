#!/usr/bin/env npx tsx
/**
 * Auto-Generate API Reference Documentation
 *
 * Reads structured data from the transpiler's source modules and
 * generates static HTML reference pages for the docs site.
 *
 * Usage: npx tsx scripts/generate-docs.ts
 *        npm run docs
 *
 * Outputs:
 *   docs/site/reference/functions.html
 *   docs/site/reference/events.html
 *   docs/site/reference/constants.html
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

import { LSL_FUNCTION_MAP } from "../src/api/ll-map.js";
import {
  LSL_EVENTS,
  EVENT_NAME_MAP,
  EVENT_PARAMS,
  DETECTED_EVENTS,
} from "../src/transpiler/event-map.js";
import { LSL_CONSTANTS } from "../src/transpiler/constants.js";
import { BUILTIN_RETURN_TYPES } from "../src/transpiler/type-tracker.js";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "docs/site/reference");
mkdirSync(OUT, { recursive: true });

// ── HTML helpers ────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function pageShell(title: string, breadcrumb: string, heading: string, subtitle: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} — BlackBox Scripter Docs</title>
  <link rel="icon" type="image/svg+xml" href="../images/poqpoq-favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/docs.css">
</head>
<body>

  <div id="site-header"></div>

  <div class="page-layout">
    <nav id="sidebar-nav"></nav>

    <main class="content-area">

      <div class="breadcrumb">
        <a href="../">Home</a>
        <span class="separator">&rsaquo;</span>
        <a href="../">Reference</a>
        <span class="separator">&rsaquo;</span>
        ${breadcrumb}
      </div>

      <h1>${heading}</h1>
      <p class="page-subtitle">${subtitle}</p>

${body}

    </main>
  </div>

  <div id="site-footer"></div>

  <script src="../js/nav.js"></script>
</body>
</html>
`;
}

function statusBadge(status: string): string {
  return `<span class="badge status-${status}">${status}</span>`;
}

// ── Async function set ──────────────────────────────────

const ASYNC_FUNCTIONS = new Set([
  "llSleep", "llHTTPRequest", "llGetNotecardLine", "llGetNumberOfNotecardLines",
  "osNpcCreate", "osNpcRemove", "osNpcMoveTo", "osNpcMoveToTarget",
  "osGetNotecard", "llTransferLindenDollars",
]);

// ── Generate functions.html ─────────────────────────────

function generateFunctions(): void {
  // Group by category
  const groups = new Map<string, typeof LSL_FUNCTION_MAP>();
  for (const fn of LSL_FUNCTION_MAP) {
    const list = groups.get(fn.category) ?? [];
    list.push(fn);
    groups.set(fn.category, list);
  }

  // Pretty category names
  const categoryLabels: Record<string, string> = {
    communication: "Communication",
    object: "Object Manipulation",
    physics: "Physics",
    agent: "Agent Interaction",
    effects: "Effects & Sound",
    timer: "Timer & Sleep",
    perception: "Perception & Sensors",
    data: "Data & HTTP",
    math: "Math",
    string: "String",
    list: "List / Array",
    environment: "Environment",
    "ossl-npc": "OSSL — NPC",
    "ossl-data": "OSSL — Data",
    "ossl-terrain": "OSSL — Terrain",
    "ossl-agent": "OSSL — Agent",
    "ossl-texture": "OSSL — Texture",
    media: "Media on a Prim",
    dialog: "Dialog / UI",
    inventory: "Inventory",
    economy: "Economy / Money",
  };

  const categories = [...groups.keys()];
  const totalFunctions = LSL_FUNCTION_MAP.length;
  const totalCategories = categories.length;

  let body = "";

  // Search input
  body += `      <div class="fn-search-container">
        <input type="text" id="fn-search" class="fn-search" placeholder="Search functions... (e.g. llSay, setPosition, math)">
      </div>\n`;

  // Summary
  body += `      <p class="fn-summary">${totalFunctions} functions across ${totalCategories} categories</p>\n\n`;

  // Table of contents
  body += `      <div class="fn-toc">\n`;
  for (const cat of categories) {
    const label = categoryLabels[cat] ?? cat;
    const count = groups.get(cat)!.length;
    body += `        <a href="#${cat}">${esc(label)} <span class="fn-toc-count">(${count})</span></a>\n`;
  }
  body += `      </div>\n\n`;

  // Category sections
  for (const cat of categories) {
    const fns = groups.get(cat)!;
    const label = categoryLabels[cat] ?? cat;

    body += `      <div class="category-section" id="${cat}">\n`;
    body += `        <h2>${esc(label)}</h2>\n`;
    body += `        <table class="fn-table">\n`;
    body += `          <thead><tr><th>LSL Function</th><th>poqpoq API</th><th>Return</th><th>Status</th><th>Notes</th></tr></thead>\n`;
    body += `          <tbody>\n`;

    for (const fn of fns) {
      const returnType = BUILTIN_RETURN_TYPES[fn.lsl] ?? "";
      const isAsync = ASYNC_FUNCTIONS.has(fn.lsl);
      const asyncBadge = isAsync ? ' <span class="badge async-badge">async</span>' : "";
      const notes = fn.notes ? esc(fn.notes) : "";

      body += `            <tr class="fn-row">\n`;
      body += `              <td class="fn-name"><code>${esc(fn.lsl)}</code>${asyncBadge}</td>\n`;
      body += `              <td class="fn-api"><code>${esc(fn.api)}</code></td>\n`;
      body += `              <td class="fn-return">${returnType ? `<code>${esc(returnType)}</code>` : '<span class="text-dim">—</span>'}</td>\n`;
      body += `              <td>${statusBadge(fn.status)}</td>\n`;
      body += `              <td class="fn-notes">${notes}</td>\n`;
      body += `            </tr>\n`;
    }

    body += `          </tbody>\n`;
    body += `        </table>\n`;
    body += `      </div>\n\n`;
  }

  const html = pageShell(
    "Function Reference",
    "Functions",
    'Function <span class="accent">Reference</span>',
    "Every LSL function mapped to its poqpoq TypeScript equivalent. Auto-generated from source.",
    body,
  );

  writeFileSync(join(OUT, "functions.html"), html);
  console.log(`  functions.html — ${totalFunctions} functions, ${totalCategories} categories`);
}

// ── Generate events.html ────────────────────────────────

function generateEvents(): void {
  const events = [...LSL_EVENTS].sort();

  let body = "";
  body += `      <p class="fn-summary">${events.length} events</p>\n\n`;

  body += `      <table class="fn-table">\n`;
  body += `        <thead><tr><th>LSL Event</th><th>poqpoq Handler</th><th>Parameters</th><th>Flags</th></tr></thead>\n`;
  body += `        <tbody>\n`;

  for (const evt of events) {
    const handler = EVENT_NAME_MAP[evt] ?? '<span class="text-dim">—</span>';
    const params = EVENT_PARAMS[evt] ?? "";
    const isDetected = DETECTED_EVENTS.has(evt);
    const flags = isDetected ? '<span class="badge detected-badge">detected</span>' : "";

    body += `          <tr class="fn-row">\n`;
    body += `            <td class="fn-name"><code>${esc(evt)}</code></td>\n`;
    body += `            <td class="fn-api"><code>${typeof handler === "string" && !handler.startsWith("<") ? esc(handler) : handler}</code></td>\n`;
    body += `            <td class="fn-notes"><code>${esc(params)}</code></td>\n`;
    body += `            <td>${flags}</td>\n`;
    body += `          </tr>\n`;
  }

  body += `        </tbody>\n`;
  body += `      </table>\n\n`;

  // Detected events explanation
  body += `      <div class="callout callout-info">\n`;
  body += `        <div class="callout-title">Detected Events</div>\n`;
  body += `        <p>Events marked <span class="badge detected-badge">detected</span> receive a <code>detected[]</code> array parameter.\n`;
  body += `        Each element has: <code>id</code>, <code>name</code>, <code>position</code>, <code>rotation</code>, <code>velocity</code>,\n`;
  body += `        <code>type</code>, <code>ownerId</code>, <code>groupId</code>, <code>grabOffset</code>, <code>linkNumber</code>,\n`;
  body += `        <code>touchFace</code>, <code>touchNormal</code>, <code>touchBinormal</code>, <code>touchPosition</code>,\n`;
  body += `        <code>touchST</code>, <code>touchUV</code>.</p>\n`;
  body += `      </div>\n`;

  const html = pageShell(
    "Event Reference",
    "Events",
    'Event <span class="accent">Reference</span>',
    "All LSL events with their poqpoq handler names, parameter signatures, and capabilities.",
    body,
  );

  writeFileSync(join(OUT, "events.html"), html);
  console.log(`  events.html — ${events.length} events`);
}

// ── Generate constants.html ─────────────────────────────

function generateConstants(): void {
  // Group constants by reading the comment structure from the source
  // We'll infer groups from naming patterns
  const groups: { label: string; entries: [string, string][] }[] = [];
  let currentGroup: { label: string; entries: [string, string][] } | null = null;

  const groupRules: [RegExp | ((k: string) => boolean), string][] = [
    [k => k === "TRUE" || k === "FALSE", "Booleans"],
    [k => k === "NULL_KEY" || k === "EOF", "Null Values"],
    [k => k.includes("VECTOR") || k.includes("ROTATION") || k === "TOUCH_INVALID_TEXCOORD", "Vectors & Rotations"],
    [k => ["PI", "TWO_PI", "PI_BY_TWO", "DEG_TO_RAD", "RAD_TO_DEG", "SQRT2"].includes(k), "Math Constants"],
    [k => k.startsWith("LINK_"), "Link Targets"],
    [k => k === "ALL_SIDES", "Face / Side"],
    [k => k.startsWith("STATUS_"), "Status Flags"],
    [k => k === "AGENT" || k === "ACTIVE" || k === "PASSIVE" || k === "SCRIPTED", "Agent Types"],
    [k => k.startsWith("PERMISSION_"), "Permission Flags"],
    [k => k.startsWith("CHANGED_"), "Changed Flags"],
    [k => k.startsWith("INVENTORY_"), "Inventory Types"],
    [k => k.startsWith("ATTACH_"), "Attach Points"],
    [k => k.includes("CHANNEL"), "Channels"],
    [k => k.startsWith("CLICK_ACTION_"), "Click Actions"],
    [k => k.startsWith("ANIM_") || k === "LOOP" || k === "REVERSE" || k === "PING_PONG" || k === "SMOOTH" || k === "ROTATE" || k === "SCALE", "Texture Animation"],
    [k => k.startsWith("PSYS_"), "Particle System"],
    [k => k.startsWith("PRIM_MEDIA_"), "Media on a Prim"],
    [k => k.startsWith("PRIM_"), "Prim Parameters"],
    [k => k.startsWith("CONTROL_"), "Control Flags"],
    [k => k.startsWith("HTTP_"), "HTTP"],
    [k => k.startsWith("PAY_"), "Pay / Money"],
    [k => k.startsWith("STRING_TRIM"), "String Trim"],
    [k => k.startsWith("JSON_"), "JSON"],
    [k => k.startsWith("OBJECT_"), "Object Details"],
    [k => k.startsWith("TYPE_"), "Data Types"],
    [k => k.startsWith("OS_NPC_"), "NPC Flags (OSSL)"],
    [k => k.startsWith("PARCEL_MEDIA_"), "Parcel Media"],
  ];

  // Build group map
  const groupMap = new Map<string, [string, string][]>();

  for (const [key, value] of Object.entries(LSL_CONSTANTS)) {
    let matched = false;
    for (const [test, label] of groupRules) {
      const matches = typeof test === "function" ? test(key) : test.test(key);
      if (matches) {
        const list = groupMap.get(label) ?? [];
        list.push([key, value]);
        groupMap.set(label, list);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const list = groupMap.get("Other") ?? [];
      list.push([key, value]);
      groupMap.set("Other", list);
    }
  }

  const totalConstants = Object.keys(LSL_CONSTANTS).length;

  let body = "";
  body += `      <p class="fn-summary">${totalConstants} constants across ${groupMap.size} groups</p>\n\n`;

  for (const [label, entries] of groupMap) {
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    body += `      <div class="category-section" id="${id}">\n`;
    body += `        <h2>${esc(label)}</h2>\n`;
    body += `        <table class="fn-table">\n`;
    body += `          <thead><tr><th>LSL Constant</th><th>TypeScript Equivalent</th></tr></thead>\n`;
    body += `          <tbody>\n`;

    for (const [key, value] of entries) {
      body += `            <tr class="fn-row">\n`;
      body += `              <td class="fn-name"><code>${esc(key)}</code></td>\n`;
      body += `              <td class="fn-api"><code>${esc(value)}</code></td>\n`;
      body += `            </tr>\n`;
    }

    body += `          </tbody>\n`;
    body += `        </table>\n`;
    body += `      </div>\n\n`;
  }

  const html = pageShell(
    "Constants Reference",
    "Constants",
    'Constants <span class="accent">Reference</span>',
    "All LSL constants and their TypeScript equivalents. Auto-generated from source.",
    body,
  );

  writeFileSync(join(OUT, "constants.html"), html);
  console.log(`  constants.html — ${totalConstants} constants, ${groupMap.size} groups`);
}

// ── Main ────────────────────────────────────────────────

console.log("Generating API reference documentation...\n");

generateFunctions();
generateEvents();
generateConstants();

console.log(`\nDone. Output: docs/site/reference/`);
