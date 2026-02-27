# Avatar Team ↔ Scripter Team — Cross-Team Communication

**Date:** 2026-02-27
**From:** BlackBox Avatar team
**Re:** Shared integration patterns — Glitch preview spawn, PostMessage bridge, iframe lifecycle

---

## Context

Avatar is building a **Dressing Room** — a private Babylon.js viewport (iframe) where players customize their avatar before returning to World. We're using the same iframe + PostMessage pattern that Glitch uses for its preview spawns.

We noticed Scripter is also working on a **Glitch preview spawn** implementation. Since both Avatar and Glitch are iframe children of World, there's potential for shared conventions and protocol alignment.

---

## What Avatar Has Built (Sprint 0)

### PostMessageBridge

Our bridge handles 4 message types:

```typescript
// Incoming (from World → Avatar iframe)
{ type: "avatar_spawn", payload: { modelPath, label, manifest } }

// Outgoing (Avatar iframe → World)
{ type: "avatar_ready", source: "avatar" }
{ type: "avatar_close", source: "avatar" }
{ type: "avatar_error", source: "avatar", error: string }
```

### Embed Detection

Same pattern as Glitch:
```typescript
function isEmbedded(): boolean {
  return window.self !== window.top;
}
```

### Lifecycle

1. World opens Avatar in iframe
2. World sends `avatar_spawn` with VRM path + manifest
3. Avatar loads VRM, sets up scene, sends `avatar_ready`
4. Player customizes (dressing room is private — avatar vanishes from World)
5. Player exits → `avatar_close` sent → World reloads avatar with updated appearance

---

## Questions for Scripter Team

### Q1: Glitch Preview Spawn Protocol

What does your Glitch preview spawn message protocol look like? Specifically:

- What message type(s) does World send to spawn a Glitch preview?
- What does Glitch send back (ready/close/error)?
- Do you use a `source` field to identify which iframe is responding?

We want to ensure World can distinguish `avatar_ready` from `glitch_ready` etc. If you're using a generic format like `{ type: "tool_ready", source: "glitch" }`, we should align on that rather than each tool having its own message names.

### Q2: Shared Message Envelope

Should we converge on a shared PostMessage envelope? Something like:

```typescript
interface BBToolMessage {
  type: string;          // "tool_spawn" | "tool_ready" | "tool_close" | "tool_error"
  source: string;        // "avatar" | "glitch" | "scripter" | "skinner" etc.
  payload?: unknown;     // tool-specific data
  error?: string;        // for error messages
}
```

This would let World use a single message handler for all BB tool iframes.

### Q3: Iframe Lifecycle — Who Manages the iframe DOM?

In our model, World creates the iframe and sends the spawn message. Avatar responds when ready. On close, Avatar sends `avatar_close` and World removes the iframe.

Is Glitch's pattern the same? Or does Glitch manage its own window/iframe creation?

### Q4: Content Pass-Through

Your reference-bridge.ts shows the Scripter engine dispatching ScriptCommands to a Babylon scene. For the Glitch preview spawn specifically:

- What content gets passed in the spawn payload? (scene JSON? script bundle? manifest?)
- Does Glitch need to load assets from World's asset server, or is everything self-contained in the payload?

For Avatar, we pass a VRM model path + optional character manifest (skin tone, hair color, equipped items). The VRM loads from `public/assets/` or a server URL.

### Q5: Multiple Simultaneous Iframes

Can World have both Avatar AND Glitch open simultaneously? If so, do we need iframe IDs in messages so World knows which child is talking?

```typescript
// Potential: include iframe ID for disambiguation
{ type: "tool_ready", source: "avatar", iframeId: "avatar-frame-1" }
```

---

## What Avatar Can Offer Scripter

### VRM Material Convention

Avatar converts VRoid MToon materials → PBR on load, matching World's PBR-everywhere approach. If Scripter's `setColor` / `setAlpha` / `setTexture` commands ever need to target avatar meshes, they'll be standard PBR materials.

### Avatar Mesh Names

VRM meshes follow VRoid naming: `Face`, `Body`, `Hair001`. Primitives within Body use material-based names like `Body_00_SKIN`, `Tops_01_CLOTH`, etc. If Scripter ever needs to target avatar parts (e.g., an NPC script changing an avatar's appearance), these are the mesh IDs.

### Shared Test Harness?

Both our projects need to test PostMessage communication. If you have a mock parent window / iframe test harness, we'd love to reuse it rather than building one from scratch.

---

## File References

| What | Where |
|------|-------|
| Avatar PostMessageBridge | `BlackBoxAvatar/src/bridge/PostMessageBridge.ts` |
| Avatar EmbedDetection | `BlackBoxAvatar/src/bridge/EmbedDetection.ts` |
| Avatar entry point | `BlackBoxAvatar/src/index.ts` |
| Avatar types (spawn payload) | `BlackBoxAvatar/src/types/index.ts` |
| Scripter reference bridge | `BlackBoxScripter/src/integration/bridge/reference-bridge.ts` |
| Glitch PostMessageBridge | `glitch/src/bridge/PostMessageBridge.ts` |

---

## Contact

Repo: `BlackBoxAvatar` — https://github.com/increasinglyHuman/Avatar
Avatar CLAUDE.md has full context on VRM anatomy, deployment, and architecture.
