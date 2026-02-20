# ADR-003: Phase 6 Plan & Cross-Repo Integration

**Status:** Proposed
**Date:** 2026-02-19
**Authors:** Allen Partridge (p0qp0q), Claude
**Supersedes:** N/A
**Builds on:** ADR-001 (Language & Runtime Architecture), ADR-002 (Integration Layer Architecture)

---

## Context

Phases 1–5 of the Black Box Scripter are complete:

| Phase | What | Tests |
|-------|------|-------|
| 1. Foundation | Core types, World API, 179-function LSL mapping table | — |
| 2. Runtime | Worker pool + SES sandbox, event dispatch, timers, link messages | 72 |
| 3. Transpiler | LSL lexer, parser, type tracker, function resolver, codegen | 283 |
| 4. Editor | Monaco + IntelliSense, dual TS/LSL mode, full UI shell | — |
| 5. Integration | Protocol types, OAR bundle pipeline, host adapter | 118 |

**Total: 473 tests, all passing.**

Phase 6 is the final phase: polish this repo for production use, and define the concrete actions needed in the **World** and **Legacy** repos to complete the end-to-end pipeline.

### The Three-Repo Pipeline

```
Legacy OAR Converter          This Repo (Script Engine)           World (Babylon.js)
─────────────────────         ──────────────────────────          ──────────────────
Produces:                     Consumes + Runs:                    Renders:
  manifest.json         →       BundleParser.parse()
  assets/scripts/*.lsl  →       BundleTranspiler.transpile()
                                ScriptHostAdapter.loadBundle()
                                  ↓ ScriptCommand                   ↓
                                  ├─────────────────────────→  BabylonBridge.handle()
                                  │                               ↓ Babylon.js API
                                  │ ScriptEvent                   ↓
                                  ◄─────────────────────────  Event forwarding
```

---

## Decision

### Phase 6: Polish & Community (This Repo)

#### 6A. Example Script Library (20+ scripts)

Scripts serve double-duty: documentation AND test corpus for the full pipeline. Organized by complexity:

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Basics** | Interactive door, elevator, teleporter | Touch → action pattern |
| **Communication** | Chat relay, translator, announcement board | Listen/say channels |
| **Effects** | Fire emitter, water fountain, sparkle trail | Particle config patterns |
| **NPC** | Vendor, greeter, patrol guard | NPC API showcase |
| **Game Mechanics** | Scorekeeper, timer, collectible token | State + persistence |
| **AI-Powered** | Chatbot object, quest giver, tour guide | `world.companion.ask()` |
| **State Machines** | Traffic light, vending machine, quiz board | Multi-state patterns |
| **Multi-Object** | Drawbridge, conveyor belt, sliding puzzle | Controlling multiple objects |

Each script includes: TypeScript source, equivalent LSL original (where applicable), inline comments explaining the pattern.

**File structure:**
```
examples/
  basics/           interactive-door.ts, elevator.ts, teleporter.ts
  communication/    chat-relay.ts, announcement-board.ts
  effects/          fire-emitter.ts, water-fountain.ts, sparkle-trail.ts
  npc/              vendor.ts, greeter.ts, patrol-guard.ts
  game/             scorekeeper.ts, collectible-token.ts, timer-game.ts
  ai/               chatbot-object.ts, quest-giver.ts, tour-guide.ts
  state-machines/   traffic-light.ts, vending-machine.ts, quiz-board.ts
  multi-object/     drawbridge.ts, conveyor-belt.ts, sliding-puzzle.ts
  lsl-originals/    *.lsl (LSL versions of the above, where applicable)
```

#### 6B. LSL Migration Guide

Side-by-side comparison document covering every common LSL pattern:

| LSL Pattern | poqpoq Equivalent |
|-------------|-------------------|
| `state X { ... }` | `states = { X: { ... } }` |
| `llSay(0, msg)` | `this.say(0, msg)` |
| `llListen(ch, ...)` | `world.listen(ch, callback)` |
| `llSetTimerEvent(n)` | `this.setTimer(n)` / `this.setTimer(n, "name")` |
| `llSetPos(v)` | `this.object.setPosition(v)` |
| `llHTTPRequest(url, ...)` | `await this.http.get(url)` |
| `llSleep(n)` | `await this.delay(n)` |
| `dataserver(key, data)` | `async`/`await` on the original call |
| `llDetectedName(0)` | `agent.name` (parameter) |
| Vector math `v1 + v2` | Native `Vector3` operators |

**File:** `docs/lsl-migration-guide.md`

#### 6C. Security Audit

Adversarial testing of the SES sandbox:

- Prototype pollution attempts (`Object.prototype.x = ...`)
- `eval`/`Function` constructor escapes
- Memory bombs (infinite allocation)
- CPU bombs (infinite loops past guard)
- Worker escape attempts (postMessage abuse)
- Cross-script information leaks
- `import()` dynamic import attempts
- `SharedArrayBuffer` timing attacks

**File:** `tests/security/` directory with adversarial test scripts.

#### 6D. Performance Profiling

- **Transpiler throughput:** batch 60 scripts (virtuallyHuman corpus)
- **Worker pool startup:** time from `new ScriptHostAdapter()` to first script running
- **Event dispatch round-trip:** host → script → command → host
- **Memory per script:** baseline under SES compartment

**File:** `tests/benchmarks/` directory.

#### 6E. Documentation

- API reference (generated from TypeScript types)
- Getting started tutorial
- Architecture overview (ADR-001 + ADR-002 + this ADR)

---

### World Repo Actions

The World repo builds a **BabylonBridge** (~300 lines) that implements the protocol contract defined in Phase 5. This is the critical path item — scripts cannot produce visible results without it.

#### Action 1: `BabylonBridge` class (new file, ~300 lines)

Implements `CommandHandler` — receives typed `ScriptCommand` and executes against Babylon.js scene graph:

```typescript
// World repo: src/scripting/BabylonBridge.ts
import { ScriptHostAdapter } from "blackbox-scripter/integration";
import type { ScriptCommandEnvelope, ScriptCommand } from "blackbox-scripter/protocol";

class BabylonBridge {
  constructor(
    private scene: BABYLON.Scene,
    private audioEngine: BBWorldsAudioEngine,
    private particleSystem: ParticleEffectSystem,
    private chatSystem: ChatPanel,
  ) {}

  handle(envelope: ScriptCommandEnvelope): unknown {
    const cmd = envelope.command;
    const mesh = this.scene.getMeshByUniqueId(envelope.containerId);

    switch (cmd.type) {
      case "setPosition":
        mesh.position = new BABYLON.Vector3(cmd.position.x, cmd.position.y, cmd.position.z);
        return;
      case "setRotation":
        mesh.rotationQuaternion = new BABYLON.Quaternion(cmd.rotation.x, cmd.rotation.y, cmd.rotation.z, cmd.rotation.w);
        return;
      case "say":
        this.chatSystem.broadcast(cmd.channel, cmd.message);
        return;
      case "playSound":
        this.audioEngine.playSpatial(cmd.soundId, mesh.position, { volume: cmd.volume });
        return;
      case "setParticles":
        this.particleSystem.play(cmd.config, mesh);
        return;
      case "npcCreate":
        // Delegate to NPCManager
        return;
      // ... ~30 cases total, one per ScriptCommand type
    }
  }
}
```

All geometry conversions happen here: `{ x, y, z }` ↔ `BABYLON.Vector3`, `{ x, y, z, w }` ↔ `BABYLON.Quaternion`. This is the **only code** that imports both the engine and Babylon.js.

#### Action 2: Event forwarding (Babylon.js → ScriptEvent)

Wire Babylon.js observables to the adapter's `dispatchWorldEvent()`:

```typescript
// Touch events
scene.onPointerObservable.add((info) => {
  if (info.type === PointerEventTypes.POINTERPICK && info.pickInfo.hit) {
    adapter.dispatchWorldEvent({
      targetObjectId: info.pickInfo.pickedMesh.uniqueId,
      event: {
        type: "touchStart",
        agent: { id: currentPlayer.id, name: currentPlayer.name },
        face: info.pickInfo.faceId,
      },
    });
  }
});

// Collision events (physics)
mesh.physicsBody.onCollide((other) => {
  adapter.dispatchWorldEvent({
    targetObjectId: mesh.uniqueId,
    event: {
      type: "collisionStart",
      other: { id: other.uniqueId, name: other.name },
    },
  });
});

// Day/night cycle (EnvironmentManager)
environmentManager.onPhaseChange((phase, hour) => {
  // Broadcast to ALL scripts
  for (const objectId of adapter.getAllScriptStatus().map(s => s.objectId)) {
    adapter.dispatchWorldEvent({
      targetObjectId: objectId,
      event: { type: "dayNightCycle", phase, hour },
    });
  }
});
```

#### Action 3: WorldManifest schema update

Currently `WorldManifest` has no script support. Add:

```typescript
export interface WorldManifest {
  version: 1;
  scatter_layers: ScatterLayer[];
  interactables: Interactable[];
  npcs: NPCDefinition[];
  environment: ManifestEnvironment;
  world_scripts?: ScriptDefinition[];  // NEW: global scripts (background, zone managers)
}

export interface Interactable {
  // ... existing fields (type, position, rotation, scale, metadata)
  scripts?: ScriptBinding[];  // NEW: per-object scripts
}

export interface NPCDefinition {
  // ... existing fields (name, position, health, level)
  scripts?: ScriptBinding[];  // NEW: NPC behavior scripts
}

export interface ScriptDefinition {
  id: string;
  name: string;
  source: string;        // TypeScript source
  sourceFormat: "ts" | "lsl";  // Original format
  objectId?: string;     // Bound object (optional for world scripts)
}

export interface ScriptBinding {
  scriptId: string;      // Reference to ScriptDefinition
  enabled: boolean;
}
```

#### Action 4: WorldLoader integration

After interactables and NPCs load, initialize scripts:

```typescript
// In WorldLoader.loadFromManifest(), after NPC spawn phase:

// Phase N: World Scripts
if (manifest.world_scripts && manifest.world_scripts.length > 0) {
  const adapter = new ScriptHostAdapter({ workerUrl: "/worker-entry.js" });
  adapter.onScriptCommand((env) => bridge.handle(env));
  adapter.onLog((scriptId, level, args) => console.log(`[Script:${scriptId}]`, ...args));
  adapter.onError((scriptId, error) => console.error(`[Script:${scriptId}] ERROR:`, error));

  for (const script of manifest.world_scripts) {
    adapter.loadScript(script.source, script.objectId ?? "world");
  }
}
```

#### Action 5: BuildingManager hooks

When objects are placed or removed at runtime:

```typescript
// After placeObject() succeeds:
if (placedObject.scripts) {
  for (const binding of placedObject.scripts) {
    const script = manifest.world_scripts.find(s => s.id === binding.scriptId);
    if (script && binding.enabled) {
      adapter.loadScript(script.source, placedObject.id);
    }
  }
}

// On removeObject():
adapter.removeObject(objectId);
```

When objects are recreated from NEXUS persistence, re-bind their scripts during the load phase.

#### Action 6: NEXUS script persistence

Store script definitions and state in instance metadata (JSONB — already flexible):

```json
{
  "instance_metadata": {
    "scripts": {
      "door-script-uuid": {
        "name": "DoorController",
        "source": "export default class DoorController extends WorldScript { ... }",
        "objectId": "door-mesh-id",
        "enabled": true,
        "state": { "isOpen": false, "lastTouched": 0 }
      }
    }
  }
}
```

Script state snapshots enable resume-on-reconnect. NEXUS broadcasts script events to all connected clients for multi-user consistency.

#### Action 7: Lazy editor loading

The editor is ~4MB (Monaco). Only load when a creator explicitly opens the script editor:

```typescript
// In World's UI, when "Edit Script" button clicked:
const { Shell } = await import("blackbox-scripter/editor");
const editor = new Shell(document.getElementById("editor-container"));
```

This keeps World's initial load at ~2MB + ~50KB (runtime + protocol).

#### World File Summary

| File | Action | Lines |
|------|--------|-------|
| `src/scripting/BabylonBridge.ts` | **New** — command handler | ~300 |
| `src/scripting/EventForwarder.ts` | **New** — Babylon.js → ScriptEvent | ~150 |
| `src/scripting/ScriptingSystem.ts` | **New** — orchestrates adapter + bridge + forwarder | ~100 |
| `src/world/WorldManifest.ts` | **Modify** — add script fields | ~30 |
| `src/world/WorldLoader.ts` | **Modify** — script init phase | ~20 |
| `src/world/BuildingManager.ts` | **Modify** — script attach/detach hooks | ~30 |
| `public/worker-entry.js` | **Copy** — built worker entry from this repo | — |

**Estimated total:** ~630 new lines + ~80 modified lines in World.

---

### Legacy Repo Actions

The Legacy bundle format is **already compatible** with our `BundleParser` — the `objects → inventory → asset_uuid → assets[uuid].path` chain matches exactly. Enhancements are optional quality-of-life improvements.

#### Action 1: Script content in JSON wrappers (nice-to-have)

Currently scripts are raw `.lsl` files at `assets/scripts/{uuid}.lsl`. Could wrap in JSON with metadata:

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

Not required — our BundleParser reads raw `.lsl` files fine. But this preserves per-script permissions metadata for permission-checking in the sandbox.

#### Action 2: Pre-transpilation flag (nice-to-have)

Add to manifest `statistics`:

```json
{
  "statistics": {
    "pre_transpiled": false,
    "transpiler_version": null
  }
}
```

If Legacy pre-transpiles during export (batch mode), World can skip transpilation on load.

#### Action 3: Asset cross-reference table (nice-to-have)

Scripts that call `llStartAnimation("walk")` or `llPlaySound(uuid)` reference animations and sounds. A cross-reference in the manifest would let World pre-load those assets:

```json
{
  "script_references": {
    "script-uuid-1": {
      "animations": ["anim-uuid-1", "anim-uuid-2"],
      "sounds": ["sound-uuid-1"]
    }
  }
}
```

Currently the script engine discovers these at runtime. This is an optimization, not a blocker.

#### Action 4: virtuallyHuman integration test

The virtuallyHuman OAR at `/home/p0qp0q/blackbox/Legacy/tests/fixtures/Virtually_Human.oar` contains **60 LSL scripts** — animation controllers, rotation scripts, dialog handlers, particle emitters. Running the full batch through our transpiler validates:

- `BundleParser` handles the real manifest format (1,719 objects, 540 assets)
- `BundleTranspiler` processes all 60 scripts
- Transpiler handles real-world LSL patterns beyond our tier1-3 fixtures (e.g., `llTargetOmega`, `llRequestPermissions`, `PERMISSION_TRIGGER_ANIMATION`)

**Test approach:** Export virtuallyHuman with `--bundle` flag → feed manifest + script sources to `BundleTranspiler` → verify success rate.

---

## Priority Ordering

| Priority | Action | Repo | Rationale |
|----------|--------|------|-----------|
| **P0** | BabylonBridge + event wiring | World | Scripts can't produce visible results without this |
| **P0** | WorldManifest script fields | World | Scripts need to persist in scenes |
| **P0** | virtuallyHuman test run | This + Legacy | Validates full pipeline with real data |
| **P1** | Example script library (20+) | This | Documentation-by-example, the onboarding path |
| **P1** | WorldLoader + BuildingManager hooks | World | Scene lifecycle integration |
| **P1** | NEXUS script persistence | World | Scripts survive page reload |
| **P2** | LSL migration guide | This | Community onboarding for LSL veterans |
| **P2** | Security audit | This | Production safety before public use |
| **P2** | Legacy JSON wrappers | Legacy | Nice metadata, not blocking |
| **P3** | Performance profiling | This | Optimization pass |
| **P3** | Script package registry | This | Community feature, future scope |

---

## Consequences

### Positive

- **Example scripts as documentation** — creators learn by reading/modifying real scripts, not API docs
- **virtuallyHuman test** — validates 60 real-world scripts through the full pipeline before any user ever touches it
- **BabylonBridge isolation** — World's only coupling to the engine is one ~300-line file implementing a typed interface
- **Lazy loading preserved** — 4MB editor never loads unless needed, World stays lean
- **NEXUS persistence** — scripts survive disconnects, multi-user state stays consistent

### Negative

- **Three-repo coordination** — protocol changes require updates in all three repos. Mitigated by this repo publishing the protocol types as the single source of truth.
- **World bridge maintenance** — new `ScriptCommand` types require new `case` branches in BabylonBridge. Mitigated by TypeScript exhaustive switch checking.
- **virtuallyHuman scripts may use unmapped functions** — the transpiler handles 179 functions. Exotic `os*` functions may need new mappings added.

### Risks

- **World-side implementation timing** — BabylonBridge depends on World development schedule. Mitigated by this engine being fully testable in isolation (473 tests, no Babylon.js dependency).
- **NEXUS schema migration** — adding script fields to instance metadata requires careful versioning. Mitigated by JSONB flexibility (new fields are optional).
- **Security audit findings** — adversarial testing may reveal SES sandbox gaps requiring Phase 2 runtime fixes. This is a feature, not a bug — better to find them now.

---

## References

- [ADR-001: Language & Runtime Architecture](ADR-001-language-and-runtime-architecture.md) — Foundation decisions, Phase 6 definition
- [ADR-002: Integration Layer Architecture](ADR-002-integration-layer-architecture.md) — Protocol types, bundle pipeline, host adapter
- [World: WorldManifest.ts](../../../World/src/world/WorldManifest.ts) — Current scene manifest (no script support yet)
- [World: WorldLoader.ts](../../../World/src/world/WorldLoader.ts) — Scene loading pipeline
- [World: BuildingManager.ts](../../../World/src/world/BuildingManager.ts) — Object lifecycle
- [World: ParticleEffectSystem.ts](../../../World/src/effects/ParticleEffectSystem.ts) — Effects API (scripts control this)
- [World: BBWorldsAudioEngine.ts](../../../World/src/audio/BBWorldsAudioEngine.ts) — Audio API (scripts control this)
- [World: MultiUserManager.ts](../../../World/src/networking/MultiUserManager.ts) — NEXUS sync
- [Legacy: bundle_exporter.py](../../../Legacy/src/bundle_exporter.py) — Bundle format producer
- [Legacy: oar_parser.py](../../../Legacy/src/oar_parser.py) — OAR extraction pipeline
- [Legacy: Virtually_Human.oar](../../../Legacy/tests/fixtures/Virtually_Human.oar) — 60-script test fixture

---

## Progress Overview

### Complete (Phases 1–5)

| Phase | Tests | Key Deliverables |
|-------|-------|-----------------|
| 1. Foundation | — | 8 type files, World API interface, 179-function LSL mapping table |
| 2. Runtime | 72 | Worker pool, SES sandbox, AST transform, EventDispatcher, TimerManager, LinkMessageBus |
| 3. Transpiler | 283 | Lexer (60+ tokens), recursive descent parser, type tracker, function resolver, two-pass codegen |
| 4. Editor | — | Monaco + IntelliSense, dual TS/LSL mode, console, file management, full UI shell |
| 5. Integration | 118 | ScriptCommand/ScriptEvent protocol, BundleParser, BundleTranspiler, CommandRouter, ScriptHostAdapter |

**Total: 473 tests, 0 failures.**

### Phase 6 (This ADR)

See Implementation Steps above. Primarily content creation (examples, docs, migration guide) plus security/performance validation. World-side bridge is the critical path for end-to-end demo.

---

*This ADR was informed by analysis of the World repo's architecture (WorldManifest, WorldLoader, BuildingManager, ParticleEffectSystem, BBWorldsAudioEngine, MultiUserManager), the Legacy OAR converter pipeline (bundle_exporter.py, oar_parser.py), and the virtuallyHuman test fixture (60 LSL scripts, 1,719 objects).*
