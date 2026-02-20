# Legacy Team Brief — Script Engine Integration

**Date:** 2026-02-20
**From:** Black Box Scripter team
**Context:** [ADR-003](../adr/ADR-003-phase-6-and-cross-repo-integration.md)

---

## What's Happening

We've built a scripting engine for poqpoq World that runs LSL scripts in the browser via TypeScript transpilation. Phases 1–5 are complete (473 tests). The engine includes an **OAR bundle pipeline** that consumes the exact manifest.json format your `bundle_exporter.py` produces.

**The good news:** Your current bundle format already works. We parse it successfully. No breaking changes needed.

**This brief covers:** Optional enhancements that would make the pipeline richer.

---

## How Your Output Is Consumed

```
Your bundle_exporter.py produces:
  manifest.json                    ← We parse this with BundleParser
  assets/scripts/{uuid}.lsl       ← We read these as raw LSL source

Our pipeline:
  BundleParser.parse(manifestJson)
    → resolves: object.inventory[i].asset_uuid → assets[uuid].path
    → produces: ScriptBinding[] (objectId, scriptName, assetPath)

  BundleTranspiler.transpile(bundle, scriptSources)
    → calls transpile() on each .lsl file
    → produces: TranspiledBundle with TypeScript class per script
```

The binding chain `objects → inventory → asset_uuid → assets[uuid].path` is exactly what we use. It works today.

---

## Requested Enhancements (All Optional)

### 1. virtuallyHuman Test Run (P0 — we need this)

We need the virtuallyHuman OAR exported with `--bundle` flag so we can run all 60 scripts through our transpiler. This is our real-world validation test.

**What we need from you:** A complete bundle export of `Virtually_Human.oar` with all script files in `assets/scripts/`. If you already have one, just point us to it.

### 2. Script JSON Wrappers (P2 — nice-to-have)

Currently scripts land as raw `.lsl` files. A JSON wrapper would preserve per-script metadata:

```json
{
  "type": "script",
  "name": "DoorController",
  "uuid": "72e561d0-cdab-4a95-a47a-06e87583f362",
  "source": "default { touch_start(integer n) { llSay(0, \"Hello\"); } }",
  "creator": { "name": "Allen", "uuid": "creator-uuid" },
  "permissions": { "base": 2147483647, "next": 581632 }
}
```

This lets us enforce permissions in the sandbox (e.g., no-copy scripts can't be viewed in the editor). Not blocking — we read raw `.lsl` fine.

**Change in bundle_exporter.py:** When copying script assets, write `.json` instead of raw `.lsl`. Update the `assets[uuid].path` to point to the `.json` file.

### 3. Pre-Transpilation Flag (P2 — nice-to-have)

Add to manifest `statistics`:

```json
{
  "statistics": {
    "pre_transpiled": false,
    "transpiler_version": null
  }
}
```

If Legacy ever pre-transpiles during export (we could provide a CLI for this), World can skip transpilation on load.

### 4. Asset Cross-Reference Table (P3 — future)

Scripts that call `llStartAnimation("walk")` or `llPlaySound(uuid)` reference assets by name/UUID. A cross-reference would let World pre-load those assets:

```json
{
  "script_references": {
    "script-uuid-1": {
      "animations": ["anim-uuid-1"],
      "sounds": ["sound-uuid-1"]
    }
  }
}
```

This requires static analysis of LSL source — we could provide a utility for this. Low priority.

---

## What You Don't Need to Change

- Manifest schema (`format_version`, `objects`, `assets`, `statistics`) — works as-is
- Object metadata (permissions, flags, inventory) — we consume all of it
- Asset directory structure (`assets/scripts/`, `assets/animations/`, etc.) — perfect
- File naming (`{uuid}.lsl`) — we look up by path from manifest, not filename convention

---

## Contact

Repo: `BlackBoxScripter` — https://github.com/increasinglyHuman/BlackBoxScripter
Integration types: `src/integration/bundle/bundle-types.ts` — TypeScript interfaces matching your manifest format
Test fixtures: `tests/fixtures/bundles/` — synthetic manifests we test against

If you change the manifest format, update us so we can adjust `BundleParser`. The types are the contract.
