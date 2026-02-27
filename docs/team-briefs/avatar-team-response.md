# Scripter/Glitch Team → Avatar Team — Response Brief

**Date:** 2026-02-27
**From:** BlackBox Scripter + Glitch team
**Re:** Answers to cross-team integration questions

---

## A1: Glitch Preview Spawn Protocol

Glitch uses tool-specific message type names (not generic `tool_*` names):

```
Incoming (parent → Glitch iframe):
  { type: "glitch_spawn", source: "parent", payload: GlitchSpawnPayload }

Outgoing (Glitch iframe → parent):
  { type: "glitch_ready",  source: "glitch" }
  { type: "glitch_close",  source: "glitch" }
  { type: "glitch_error",  source: "glitch", error: string }
```

The `source` field identifies which iframe is responding. World can distinguish `glitch_ready` from `avatar_ready` by the `type` field alone — no ambiguity.

### Handshake Flow

```
1. Parent creates iframe pointing to /glitch/?embed=scripter
2. iframe loads → parent sends  glitch_spawn  (on iframe load event)
3. Glitch spawns scene (engine, lighting, mannequin, cameras)
4. Glitch sends  glitch_ready  back to parent
5. Parent confirms connection, begins sending commands
```

**Important timing note:** The parent sends `glitch_spawn` on the iframe's `load` event, NOT after receiving `glitch_ready`. We learned the hard way that waiting for `glitch_ready` before sending the spawn creates a deadlock (Glitch only sends `glitch_ready` after spawning, which requires the spawn payload).

### GlitchSpawnPayload Shape

```typescript
interface GlitchSpawnPayload {
  glitchType: 'generic' | 'scripter' | 'npc';
  label: string;
  camera?: { mode: 'orbit' | 'ots'; distance?: number };
  options?: { showGrid?: boolean; showHUD?: boolean };
  spawnPoint?: { x: number; y: number; z: number };
}
```

---

## A2: Shared Message Envelope

We like the idea of a shared convention but recommend **keeping tool-specific type names** rather than a generic `tool_ready` / `tool_spawn`. Here's why:

1. **Type safety** — TypeScript discriminated unions work cleanly: `type ToolMessage = GlitchMessage | AvatarMessage`. A generic `BBToolMessage` with `source: string` loses the type narrowing.

2. **No handler collisions** — Each tool registers only for its own message types. No risk of Avatar accidentally handling a `tool_ready` meant for Glitch.

3. **The `source` field is already the disambiguator** — If World ever needs a single handler, it can switch on `data.type.split('_')[0]` (e.g., `"glitch"`, `"avatar"`).

**Recommendation:** Keep the naming pattern consistent across tools:

| Pattern | Glitch | Avatar | Skinner (future) |
|---------|--------|--------|-------------------|
| Spawn   | `glitch_spawn` | `avatar_spawn` | `skinner_spawn` |
| Ready   | `glitch_ready` | `avatar_ready` | `skinner_ready` |
| Close   | `glitch_close` | `avatar_close` | `skinner_close` |
| Error   | `glitch_error` | `avatar_error` | `skinner_error` |

Consistent naming, but tool-specific message types. Best of both worlds.

---

## A3: Iframe Lifecycle — Who Manages the iframe DOM?

Same pattern as Avatar. **The parent creates and destroys the iframe**, the tool responds.

For the Scripter → Glitch integration specifically:

- **Scripter's `PreviewPanel`** creates the iframe, sets `src=/glitch/?embed=scripter`
- On iframe `load`, sends `glitch_spawn` via `postMessage`
- On `glitch_close`, Scripter removes the iframe and cleans up

Glitch never creates its own iframe. It detects embed mode via:

```typescript
function isEmbedded(): boolean {
  return window.self !== window.top;
}
```

When embedded, it waits for the spawn payload. When standalone (dev mode), it boots immediately with defaults.

---

## A4: Content Pass-Through

### What gets passed in the spawn payload

For the **scripter** glitch type, the spawn payload is lightweight — just config, not content:

```typescript
{
  glitchType: "scripter",
  label: "Script Preview",
  camera: { mode: "orbit", distance: 5 },
  options: { showGrid: true }
}
```

**Script content flows separately** through the PostMessage bridge as ongoing commands:

1. `scripter_create_prim` — Creates a root prim for a script (objectId, primType, position)
2. `scripter_load` — Notifies that a script is loaded (scriptId, objectId)
3. `scripter_command` — ScriptCommand envelopes (setPosition, setColor, say, etc.)
4. `scripter_reset` — Resets the scene (disposes all script-created objects)

### Asset loading

Glitch loads its own assets (mannequin GLB, grid textures) from its own `public/` directory. Script commands that reference textures/sounds by URL would need those URLs to be accessible — but LSL scripts typically reference assets by UUID, which we detect and skip in preview (no SL asset server to resolve them from).

For Avatar's use case (VRM model path), the same pattern works: pass the model URL in the spawn payload, and Avatar loads it. No asset bundling needed.

---

## A5: Multiple Simultaneous Iframes

**Currently no** — Scripter only opens one Glitch preview at a time. But the architecture supports it.

If World needs both Avatar AND Glitch open simultaneously:

1. **Message types already disambiguate** — `avatar_ready` vs `glitch_ready` are different types, so World's single `message` listener can route correctly without iframe IDs.

2. **Origin/source is sufficient** — If you ever need per-instance disambiguation (e.g., two Glitch previews), adding an `instanceId` to messages would work. But we haven't needed it.

3. **Recommendation:** Don't add `iframeId` yet. The type-prefix naming (`avatar_*` vs `glitch_*`) provides clean routing. Add instance IDs only if World genuinely needs multiple iframes of the **same** tool type.

---

## What We Can Offer Avatar

### PostMessage Test Harness

We have a test helper for PostMessageBridge in [PostMessageBridge.test.ts](glitch/src/bridge/PostMessageBridge.test.ts). It uses Vitest's `vi.fn()` to mock `window.addEventListener` and dispatches synthetic `MessageEvent`s. Happy to share patterns.

### `__DEV__` Logging Convention

We just implemented a `__DEV__` flag (Vite `define`) that gates all verbose console.log behind a build-time constant. In production builds, esbuild tree-shakes them out entirely — 50 debug logs → 3 essential logs. Recommend Avatar adopt the same pattern:

```typescript
// vite.config.ts
define: {
  __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
}

// src/env.d.ts
declare const __DEV__: boolean;

// usage
if (__DEV__) console.log('[Avatar] VRM loaded:', modelPath);
```

### EmbedDetection

Your `isEmbedded()` matches ours exactly — good to keep this identical across all BB tools.

---

## File References

| What | Where |
|------|-------|
| Glitch PostMessageBridge | `glitch/src/bridge/PostMessageBridge.ts` |
| Glitch EmbedDetection | `glitch/src/bridge/EmbedDetection.ts` |
| Glitch entry point | `glitch/src/index.ts` |
| Glitch types (spawn payload) | `glitch/src/types/index.ts` |
| Glitch ScriptBridge | `glitch/src/scripting/GlitchScriptBridge.ts` |
| Scripter PreviewPanel | `BlackBoxScripter/src/editor/preview/PreviewPanel.ts` |
| Scripter PreviewRelay | `BlackBoxScripter/src/editor/preview/PreviewRelay.ts` |
| PostMessageBridge tests | `glitch/src/bridge/PostMessageBridge.test.ts` |

---

## Contact

Repos:
- `BlackBoxScripter` — https://github.com/increasinglyHuman/BlackBoxScripter
- `poqpoq-glitch` — (internal, same monorepo)
