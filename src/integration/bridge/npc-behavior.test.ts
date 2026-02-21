/**
 * NPC Behavior — Tests for FSM behavior runners.
 */

import { describe, it, expect } from "vitest";
import {
  PatrolRunner,
  WanderRunner,
  FollowRunner,
  GuardRunner,
  SteeringPresets,
} from "./npc-behavior.js";
import type { Vec3Like } from "./engine-types.js";

const ORIGIN: Vec3Like = { x: 0, y: 0, z: 0 };

describe("PatrolRunner", () => {
  it("visits waypoints in sequence", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 } },
      { position: { x: 20, y: 0, z: 0 } },
    ], false);

    // First update: move to waypoint 0
    const cmds1 = runner.update(0.1, ORIGIN);
    expect(cmds1.length).toBeGreaterThan(0);
    expect(cmds1[0].type).toBe("npcMoveTo");
    expect(runner.waypointIndex).toBe(0);

    // Simulate arrival at wp0
    const cmds2 = runner.update(0.1, { x: 10, y: 0, z: 0 });
    // Should advance to wp1
    const hasMoveTo = cmds2.some(c => c.type === "npcMoveTo");
    expect(hasMoveTo).toBe(true);
    expect(runner.waypointIndex).toBe(1);
  });

  it("loops when configured", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 } },
    ], true); // loop = true

    // Move to wp0 and arrive
    runner.update(0.1, ORIGIN);
    runner.update(0.1, { x: 10, y: 0, z: 0 });

    // Should loop back to wp0
    expect(runner.waypointIndex).toBe(0);
    expect(runner.isFinished).toBe(false);
  });

  it("finishes when loop is false", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 } },
    ], false);

    runner.update(0.1, ORIGIN);
    runner.update(0.1, { x: 10, y: 0, z: 0 });

    expect(runner.isFinished).toBe(true);
  });

  it("pauses at waypoints with pauseDuration", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 }, pauseDuration: 2.0 },
      { position: { x: 20, y: 0, z: 0 } },
    ], true);

    // Move to wp0
    runner.update(0.1, ORIGIN);
    // Arrive at wp0
    runner.update(0.1, { x: 10, y: 0, z: 0 });

    // Still pausing (1 second of 2)
    const cmds1 = runner.update(1.0, { x: 10, y: 0, z: 0 });
    expect(cmds1.length).toBe(0); // No commands while pausing
    expect(runner.waypointIndex).toBe(0);

    // Pause complete (another 1.5 seconds)
    const cmds2 = runner.update(1.5, { x: 10, y: 0, z: 0 });
    // Should advance and send moveTo for next waypoint
    expect(cmds2.length).toBeGreaterThan(0);
  });

  it("plays animations at waypoints", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 }, animation: "wave" },
    ], false);

    runner.update(0.1, ORIGIN);
    const cmds = runner.update(0.1, { x: 10, y: 0, z: 0 });

    const animCmd = cmds.find(c => c.type === "npcPlayAnimation");
    expect(animCmd).toBeDefined();
    if (animCmd && animCmd.type === "npcPlayAnimation") {
      expect(animCmd.animation).toBe("wave");
    }
  });

  it("says messages at waypoints", () => {
    const runner = new PatrolRunner("npc-1", [
      { position: { x: 10, y: 0, z: 0 }, say: "Halt!" },
    ], false);

    runner.update(0.1, ORIGIN);
    const cmds = runner.update(0.1, { x: 10, y: 0, z: 0 });

    const sayCmd = cmds.find(c => c.type === "npcSay");
    expect(sayCmd).toBeDefined();
    if (sayCmd && sayCmd.type === "npcSay") {
      expect(sayCmd.message).toBe("Halt!");
    }
  });
});

describe("WanderRunner", () => {
  it("produces movement commands on interval", () => {
    const runner = new WanderRunner("npc-1", ORIGIN, 10, 1.5, 1.0);

    // First update at t=0 should generate (timer starts at 0)
    const cmds1 = runner.update(0.1, { x: 5, y: 0, z: 5 });
    expect(cmds1.length).toBe(1);
    expect(cmds1[0].type).toBe("npcMoveTo");

    // Update at t=0.5 (timer still counting down)
    const cmds2 = runner.update(0.5, { x: 5, y: 0, z: 5 });
    expect(cmds2.length).toBe(0);
  });

  it("stays within radius", () => {
    const runner = new WanderRunner("npc-1", ORIGIN, 10);

    for (let i = 0; i < 20; i++) {
      const cmds = runner.update(3.0, { x: 5, y: 0, z: 5 });
      for (const cmd of cmds) {
        if (cmd.type === "npcMoveTo") {
          const pos = cmd.position;
          const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
          expect(dist).toBeLessThanOrEqual(10.5); // Small tolerance
        }
      }
    }
  });
});

describe("FollowRunner", () => {
  it("maintains distance from target", () => {
    const runner = new FollowRunner("npc-1", "player-1", 3.0);

    // NPC at origin, target at (10, 0, 0) — should move toward
    const cmds = runner.update(ORIGIN, { x: 10, y: 0, z: 0 });
    expect(cmds.length).toBe(1);
    expect(cmds[0].type).toBe("npcMoveTo");
  });

  it("pauses when close enough", () => {
    const runner = new FollowRunner("npc-1", "player-1", 3.0);

    // NPC at (8, 0, 0), target at (10, 0, 0) — dist=2, within followDistance
    const cmds = runner.update({ x: 8, y: 0, z: 0 }, { x: 10, y: 0, z: 0 });
    expect(cmds.length).toBe(0);
  });

  it("resumes when target moves away", () => {
    const runner = new FollowRunner("npc-1", "player-1", 3.0);

    // Close enough
    const cmds1 = runner.update({ x: 8, y: 0, z: 0 }, { x: 10, y: 0, z: 0 });
    expect(cmds1.length).toBe(0);

    // Target moved far
    const cmds2 = runner.update({ x: 8, y: 0, z: 0 }, { x: 50, y: 0, z: 0 });
    expect(cmds2.length).toBe(1);
  });

  it("exposes target ID", () => {
    const runner = new FollowRunner("npc-1", "player-1", 3.0);
    expect(runner.target).toBe("player-1");
  });
});

describe("GuardRunner", () => {
  it("starts in idle state", () => {
    const guard = new GuardRunner("npc-1", ORIGIN);
    expect(guard.currentState).toBe("idle");
  });

  it("switches to alert when target enters aggro range", () => {
    const guard = new GuardRunner("npc-1", ORIGIN, { aggroRange: 10 });

    // No target nearby — stays idle
    guard.update(1.0, { x: 2, y: 0, z: 0 }, null);
    expect(guard.currentState).toBe("idle");

    // Target enters aggro range
    guard.update(0.1, { x: 2, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
    expect(guard.currentState).toBe("alert");
  });

  it("returns to idle when target escapes leash range", () => {
    const guard = new GuardRunner("npc-1", ORIGIN, { aggroRange: 10, leashRadius: 20 });

    // Trigger aggro
    guard.update(0.1, { x: 2, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
    expect(guard.currentState).toBe("alert");

    // Target escapes beyond leash
    guard.update(0.1, { x: 2, y: 0, z: 0 }, { x: 50, y: 0, z: 0 });
    expect(guard.currentState).toBe("idle");
  });

  it("returns to idle when target disappears", () => {
    const guard = new GuardRunner("npc-1", ORIGIN, { aggroRange: 10 });

    // Trigger aggro
    guard.update(0.1, { x: 2, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });
    expect(guard.currentState).toBe("alert");

    // Target gone
    guard.update(0.1, { x: 2, y: 0, z: 0 }, null);
    expect(guard.currentState).toBe("idle");
  });

  it("respects tether radius during pursuit", () => {
    const guard = new GuardRunner("npc-1", ORIGIN, {
      aggroRange: 10,
      leashRadius: 15,
    });

    // Trigger aggro
    guard.update(0.1, { x: 2, y: 0, z: 0 }, { x: 5, y: 0, z: 0 });

    // NPC far from anchor, within leash
    const cmds = guard.update(0.1, { x: 14, y: 0, z: 0 }, { x: 16, y: 0, z: 0 });
    // Should produce movement command
    expect(cmds.length).toBeGreaterThan(0);
    expect(guard.currentState).toBe("alert");

    // NPC exceeds leash radius
    const cmds2 = guard.update(0.1, { x: 20, y: 0, z: 0 }, { x: 25, y: 0, z: 0 });
    expect(guard.currentState).toBe("idle");
  });
});

describe("SteeringPresets", () => {
  it("tetheredWander creates wander + tether config", () => {
    const config = SteeringPresets.tetheredWander(ORIGIN, 10);
    expect(config).toHaveLength(2);
    expect(config[0].behavior).toBe("wander");
    expect(config[1].behavior).toBe("tether");
    if (config[1].behavior === "tether") {
      expect(config[1].radius).toBe(10);
    }
  });

  it("boids creates separation + cohesion + alignment + wander config", () => {
    const config = SteeringPresets.boids();
    expect(config).toHaveLength(4);
    expect(config[0].behavior).toBe("separation");
    expect(config[1].behavior).toBe("cohesion");
    expect(config[2].behavior).toBe("alignment");
    expect(config[3].behavior).toBe("wander");
  });

  it("chaseWithLeash creates pursue + tether config", () => {
    const config = SteeringPresets.chaseWithLeash("player-1", ORIGIN, 20);
    expect(config).toHaveLength(2);
    expect(config[0].behavior).toBe("pursue");
    expect(config[1].behavior).toBe("tether");
  });
});
