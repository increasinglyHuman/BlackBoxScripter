# World Team Brief — Black Box Scripter Integration

**Date:** 2026-02-20
**From:** Black Box Scripter team
**Context:** [ADR-003](../adr/ADR-003-phase-6-and-cross-repo-integration.md)

---

## What's Happening

We've built a complete scripting engine for poqpoq World: TypeScript-based with LSL backward compatibility, Monaco editor, Web Worker + SES sandbox, and a typed protocol for communicating with the host application. Phases 1–5 are complete (473 tests, zero Babylon.js dependencies).

**Your job:** Build the ~630-line bridge that connects our typed protocol to your Babylon.js scene graph. This is the critical path — scripts can't produce visible results without it.

---

## Architecture Overview

```
Script Engine (this package)              World (your repo)
────────────────────────────              ─────────────────
ScriptHostAdapter                         BabylonBridge (YOU BUILD THIS)
  ├─ ScriptManager (workers)                ├─ scene: BABYLON.Scene
  ├─ EventDispatcher                        ├─ audioEngine
  ├─ CommandRouter                          ├─ particleSystem
  ├─ BundleTranspiler                       └─ chatSystem
  │
  │  ScriptCommand (JSON)                   │
  ├─────────────────────────────────────→   handle(envelope)
  │  { type: "setPosition",                 │  mesh.position = new Vector3(...)
  │    position: {x,y,z} }                  │
  │                                         │
  │  ScriptEvent (JSON)                     │
  ◄─────────────────────────────────────    dispatchWorldEvent(envelope)
  │  { type: "touchStart",                  │  scene.onPointerObservable
  │    agent: {id,name}, face: 0 }          │
```

**Key principle:** All messages are plain JSON. No class instances cross the boundary. You convert `{x,y,z}` ↔ `BABYLON.Vector3` on your side.

---

## How to Install

```bash
# From your World repo:
npm install blackbox-scripter
```

```typescript
// Always loaded (~50KB runtime + protocol types)
import { ScriptHostAdapter } from "blackbox-scripter/integration";
import type { ScriptCommand, ScriptCommandEnvelope } from "blackbox-scripter/protocol";

// Lazy-loaded (~4MB) only when creator opens the editor
const { Shell } = await import("blackbox-scripter/editor");
```

---

## What You Need to Build

### 1. BabylonBridge (~300 lines) — P0

Receives `ScriptCommandEnvelope` and executes against your scene:

```typescript
// src/scripting/BabylonBridge.ts
import type { ScriptCommandEnvelope } from "blackbox-scripter/protocol";

export class BabylonBridge {
  constructor(
    private scene: BABYLON.Scene,
    private audioEngine: BBWorldsAudioEngine,
    private particleSystem: ParticleEffectSystem,
    private chatSystem: ChatPanel,
    private npcManager: NPCManager,
  ) {}

  handle(envelope: ScriptCommandEnvelope): unknown {
    const cmd = envelope.command;
    // containerId = the object UUID this script is attached to
    const mesh = this.scene.getMeshByUniqueId(envelope.containerId);

    switch (cmd.type) {
      // --- Transform ---
      case "setPosition":
        mesh.position.set(cmd.position.x, cmd.position.y, cmd.position.z);
        return;
      case "setRotation":
        mesh.rotationQuaternion = new BABYLON.Quaternion(
          cmd.rotation.x, cmd.rotation.y, cmd.rotation.z, cmd.rotation.w
        );
        return;
      case "setScale":
        mesh.scaling.set(cmd.scale.x, cmd.scale.y, cmd.scale.z);
        return;

      // --- Appearance ---
      case "setColor":
        (mesh.material as BABYLON.PBRMaterial).albedoColor =
          new BABYLON.Color3(cmd.color.r, cmd.color.g, cmd.color.b);
        return;
      case "setAlpha":
        mesh.visibility = cmd.alpha;
        return;
      case "setText":
        // Update dynamic texture or GUI text
        return;

      // --- Communication ---
      case "say":
        this.chatSystem.broadcast(cmd.channel, cmd.message, mesh.name);
        return;
      case "whisper":
        this.chatSystem.whisper(cmd.channel, cmd.message, mesh.name, 10); // 10m range
        return;
      case "shout":
        this.chatSystem.shout(cmd.channel, cmd.message, mesh.name, 100); // 100m range
        return;
      case "dialog":
        // Show UI dialog to the target agent
        return;

      // --- Effects ---
      case "playSound":
        this.audioEngine.playSpatial(cmd.soundId, mesh.position, {
          volume: cmd.volume, loop: cmd.loop
        });
        return;
      case "setParticles":
        this.particleSystem.play(cmd.config, mesh);
        return;
      case "stopParticles":
        this.particleSystem.stop(mesh);
        return;

      // --- Animation ---
      case "playAnimation":
        const animGroup = this.scene.getAnimationGroupByName(cmd.animationName);
        animGroup?.play(cmd.loop);
        return;

      // --- Physics ---
      case "applyForce":
        mesh.physicsBody?.applyForce(
          new BABYLON.Vector3(cmd.force.x, cmd.force.y, cmd.force.z),
          mesh.position
        );
        return;
      case "applyImpulse":
        mesh.physicsBody?.applyImpulse(
          new BABYLON.Vector3(cmd.impulse.x, cmd.impulse.y, cmd.impulse.z),
          mesh.position
        );
        return;

      // --- NPC ---
      case "npcCreate":
        return this.npcManager.create(cmd.name, cmd.appearance, cmd.position);
      case "npcMoveTo":
        return this.npcManager.moveTo(cmd.npcId, cmd.position);
      case "npcSay":
        return this.npcManager.say(cmd.npcId, cmd.message);

      // --- HTTP ---
      case "httpRequest":
        // Proxy through server to avoid CORS
        return fetch(`/api/proxy?url=${encodeURIComponent(cmd.url)}`, {
          method: cmd.method, body: cmd.body
        }).then(r => r.text());

      default:
        console.warn(`[BabylonBridge] Unknown command: ${(cmd as any).type}`);
    }
  }
}
```

**Full command list** (see `src/integration/protocol/script-command.ts` in our repo):
setPosition, setRotation, setScale, setColor, setAlpha, setTexture, setText, setGlow, say, whisper, shout, regionSay, instantMessage, dialog, playSound, stopSound, setParticles, stopParticles, playAnimation, stopAnimation, applyForce, applyImpulse, setPhysics, httpRequest, npcCreate, npcRemove, npcMoveTo, npcSay, npcPlayAnimation, npcStopAnimation, requestPermissions

### 2. Event Forwarding (~150 lines) — P0

Wire your Babylon.js events to our adapter's `dispatchWorldEvent()`:

```typescript
// src/scripting/EventForwarder.ts
import { ScriptHostAdapter } from "blackbox-scripter/integration";
import type { ScriptEventEnvelope } from "blackbox-scripter/protocol";

export class EventForwarder {
  constructor(
    private scene: BABYLON.Scene,
    private adapter: ScriptHostAdapter,
  ) {}

  setup() {
    // Touch/click events
    this.scene.onPointerObservable.add((info) => {
      if (info.type === BABYLON.PointerEventTypes.POINTERPICK && info.pickInfo?.hit) {
        this.adapter.dispatchWorldEvent({
          targetObjectId: info.pickInfo.pickedMesh!.uniqueId,
          event: {
            type: "touchStart",
            agent: { id: currentPlayer.id, name: currentPlayer.name },
            face: info.pickInfo.faceId ?? 0,
          },
        });
      }
    });

    // Physics collisions
    // Wire per-mesh when scripts are loaded

    // Day/night cycle
    environmentManager.onPhaseChange((phase: string, hour: number) => {
      for (const status of this.adapter.getAllScriptStatus()) {
        this.adapter.dispatchWorldEvent({
          targetObjectId: status.objectId,
          event: { type: "dayNightCycle", phase, hour },
        });
      }
    });

    // Weather changes
    environmentManager.onWeatherChange((weather: string, intensity: number) => {
      for (const status of this.adapter.getAllScriptStatus()) {
        this.adapter.dispatchWorldEvent({
          targetObjectId: status.objectId,
          event: { type: "weatherChange", weather, intensity },
        });
      }
    });

    // Chat/listen (when someone types in chat)
    chatSystem.onMessage((channel, senderName, senderId, message) => {
      for (const status of this.adapter.getAllScriptStatus()) {
        this.adapter.dispatchWorldEvent({
          targetObjectId: status.objectId,
          event: { type: "listen", channel, senderName, senderId, message },
        });
      }
    });
  }
}
```

**Full event list** (see `src/integration/protocol/script-event.ts`):
touchStart, touch, touchEnd, collisionStart, collision, collisionEnd, listen, timer, rez, changed, money, permissions, sensor, noSensor, dataserver, httpResponse, playerEnterZone, playerLeaveZone, dayNightCycle, weatherChange

### 3. Orchestrator (~100 lines) — P0

Ties everything together:

```typescript
// src/scripting/ScriptingSystem.ts
import { ScriptHostAdapter } from "blackbox-scripter/integration";
import { BabylonBridge } from "./BabylonBridge";
import { EventForwarder } from "./EventForwarder";

export class ScriptingSystem {
  private adapter: ScriptHostAdapter;
  private bridge: BabylonBridge;
  private forwarder: EventForwarder;

  constructor(scene: BABYLON.Scene, systems: WorldSystems) {
    this.adapter = new ScriptHostAdapter({
      workerUrl: "/worker-entry.js",
    });

    this.bridge = new BabylonBridge(
      scene, systems.audio, systems.particles, systems.chat, systems.npc
    );

    this.adapter.onScriptCommand((env) => this.bridge.handle(env));
    this.adapter.onLog((id, level, args) => console.log(`[Script:${id}]`, ...args));
    this.adapter.onError((id, err) => console.error(`[Script:${id}]`, err));

    this.forwarder = new EventForwarder(scene, this.adapter);
    this.forwarder.setup();
  }

  // Load a single TypeScript script onto an object
  loadScript(source: string, objectId: string) {
    return this.adapter.loadScript(source, objectId);
  }

  // Load all scripts from an OAR bundle (Legacy import)
  loadBundle(manifestJson: string, scriptSources: Map<string, string>) {
    return this.adapter.loadBundle(manifestJson, scriptSources);
  }

  // Open the editor (lazy-loads ~4MB Monaco)
  async openEditor(container: HTMLElement) {
    const { Shell } = await import("blackbox-scripter/editor");
    return new Shell(container);
  }

  // Cleanup
  removeObject(objectId: string) {
    this.adapter.removeObject(objectId);
  }
}
```

### 4. WorldManifest Schema Update (~30 lines) — P0

```typescript
// In src/world/WorldManifest.ts, add:

export interface ScriptDefinition {
  id: string;
  name: string;
  source: string;              // TypeScript source code
  sourceFormat: "ts" | "lsl";  // Original format
  objectId?: string;           // Bound object (optional for world scripts)
}

export interface ScriptBinding {
  scriptId: string;
  enabled: boolean;
}

// Then add to existing interfaces:
export interface WorldManifest {
  // ... existing fields
  world_scripts?: ScriptDefinition[];
}

export interface Interactable {
  // ... existing fields
  scripts?: ScriptBinding[];
}
```

### 5. WorldLoader Integration (~20 lines) — P1

In `loadFromManifest()`, after the NPC spawn phase:

```typescript
// Phase N: Scripts
if (manifest.world_scripts?.length) {
  debugLog(`[WorldLoader] Initializing ${manifest.world_scripts.length} world scripts`);
  for (const script of manifest.world_scripts) {
    scriptingSystem.loadScript(script.source, script.objectId ?? "world");
  }
}
```

### 6. BuildingManager Hooks (~30 lines) — P1

```typescript
// After placeObject() succeeds:
if (placedObject.scripts) {
  for (const binding of placedObject.scripts) {
    if (binding.enabled) {
      const script = manifest.world_scripts?.find(s => s.id === binding.scriptId);
      if (script) scriptingSystem.loadScript(script.source, placedObject.id);
    }
  }
}

// On removeObject():
scriptingSystem.removeObject(objectId);
```

### 7. NEXUS Persistence — P1

Store script definitions in instance metadata (JSONB):

```json
{
  "instance_metadata": {
    "scripts": {
      "door-script-uuid": {
        "name": "DoorController",
        "source": "export default class DoorController extends WorldScript { ... }",
        "objectId": "door-mesh-id",
        "enabled": true
      }
    }
  }
}
```

### 8. Worker Entry File — P0

Copy the built `worker-entry.js` from our `dist/` to your `public/` directory. This is the Web Worker that runs scripts in the sandbox.

---

## File Summary

| File | Action | Est. Lines |
|------|--------|------------|
| `src/scripting/BabylonBridge.ts` | **New** | ~300 |
| `src/scripting/EventForwarder.ts` | **New** | ~150 |
| `src/scripting/ScriptingSystem.ts` | **New** | ~100 |
| `src/world/WorldManifest.ts` | **Modify** | +30 |
| `src/world/WorldLoader.ts` | **Modify** | +20 |
| `src/world/BuildingManager.ts` | **Modify** | +30 |
| `public/worker-entry.js` | **Copy** from engine dist | — |
| **Total** | | ~630 new + ~80 modified |

---

## Priority Order

1. **P0:** BabylonBridge + EventForwarder + ScriptingSystem + WorldManifest schema + worker file
2. **P1:** WorldLoader integration + BuildingManager hooks + NEXUS persistence
3. **P2:** Lazy editor loading (the `await import("blackbox-scripter/editor")` path)

---

## What We Provide

- `blackbox-scripter` npm package with typed exports
- `ScriptHostAdapter` — the one class you instantiate (facade for everything)
- `ScriptCommand` / `ScriptEvent` — TypeScript discriminated unions (compile-time safety)
- `BundleParser` + `BundleTranspiler` — OAR bundle → transpiled scripts pipeline
- `worker-entry.js` — prebuilt Web Worker for the sandbox

**You never import Babylon.js into our code. We never import Babylon.js. The bridge is yours.**

---

## Contact

Repo: `BlackBoxScripter` — https://github.com/increasinglyHuman/BlackBoxScripter
Protocol types: `src/integration/protocol/` — the contract
ADR-003: `docs/adr/ADR-003-phase-6-and-cross-repo-integration.md` — full context
