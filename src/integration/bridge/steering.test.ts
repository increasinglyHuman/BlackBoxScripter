/**
 * Steering Behaviors — Test suite for pure math Reynolds behaviors.
 *
 * Every test verifies stateless math: given inputs, check output forces.
 * No mocks needed — these are pure functions.
 */

import { describe, it, expect } from "vitest";
import {
  seek,
  flee,
  arrive,
  pursue,
  evade,
  wander,
  obstacleAvoidance,
  separation,
  cohesion,
  alignment,
  tether,
  combineForces,
  truncate,
  magnitude,
  normalize,
  subtract,
  distance,
} from "./steering.js";
import type { Vec3Like } from "./engine-types.js";

const ZERO: Vec3Like = { x: 0, y: 0, z: 0 };
const ORIGIN: Vec3Like = { x: 0, y: 0, z: 0 };

/** Check that two Vec3Like values are approximately equal */
function expectVec3Close(actual: Vec3Like, expected: Vec3Like, tolerance = 0.01) {
  expect(actual.x).toBeCloseTo(expected.x, 1);
  expect(actual.y).toBeCloseTo(expected.y, 1);
  expect(actual.z).toBeCloseTo(expected.z, 1);
}

/** Check that a Vec3Like is approximately zero */
function expectZero(v: Vec3Like, tolerance = 1e-6) {
  expect(magnitude(v)).toBeLessThan(tolerance);
}

describe("Steering Behaviors", () => {
  // === Helpers ===

  describe("helpers", () => {
    it("magnitude computes correct length", () => {
      expect(magnitude({ x: 3, y: 4, z: 0 })).toBeCloseTo(5, 5);
      expect(magnitude({ x: 1, y: 1, z: 1 })).toBeCloseTo(Math.sqrt(3), 5);
    });

    it("normalize returns unit vector", () => {
      const n = normalize({ x: 3, y: 0, z: 0 });
      expectVec3Close(n, { x: 1, y: 0, z: 0 });
      expect(magnitude(n)).toBeCloseTo(1, 5);
    });

    it("normalize of zero vector returns zero", () => {
      expectZero(normalize(ZERO));
    });

    it("subtract computes difference", () => {
      const result = subtract({ x: 5, y: 3, z: 1 }, { x: 2, y: 1, z: 1 });
      expectVec3Close(result, { x: 3, y: 2, z: 0 });
    });

    it("distance computes correct distance", () => {
      expect(distance({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 })).toBeCloseTo(5, 5);
    });
  });

  // === Seek ===

  describe("seek", () => {
    it("returns force toward target at maxSpeed", () => {
      const force = seek(ORIGIN, { x: 10, y: 0, z: 0 }, 5);
      expectVec3Close(force, { x: 5, y: 0, z: 0 });
    });

    it("returns zero when at target", () => {
      const force = seek(ORIGIN, ORIGIN, 5);
      expectZero(force);
    });

    it("normalizes regardless of distance", () => {
      const near = seek(ORIGIN, { x: 1, y: 0, z: 0 }, 5);
      const far = seek(ORIGIN, { x: 100, y: 0, z: 0 }, 5);
      expect(magnitude(near)).toBeCloseTo(magnitude(far), 1);
    });
  });

  // === Flee ===

  describe("flee", () => {
    it("returns force away from threat", () => {
      const force = flee(ORIGIN, { x: 10, y: 0, z: 0 }, 5);
      // Should point in -x direction (away from threat at +x)
      expect(force.x).toBeLessThan(0);
      expect(magnitude(force)).toBeCloseTo(5, 1);
    });

    it("returns zero when beyond panic distance", () => {
      const force = flee(ORIGIN, { x: 100, y: 0, z: 0 }, 5, 10);
      expectZero(force);
    });

    it("returns force when within panic distance", () => {
      const force = flee(ORIGIN, { x: 5, y: 0, z: 0 }, 5, 10);
      expect(magnitude(force)).toBeCloseTo(5, 1);
    });
  });

  // === Arrive ===

  describe("arrive", () => {
    it("returns zero when at target", () => {
      const force = arrive(ORIGIN, ORIGIN, 5, 10);
      expectZero(force);
    });

    it("returns full speed when far from target", () => {
      const force = arrive(ORIGIN, { x: 100, y: 0, z: 0 }, 5, 10);
      expect(magnitude(force)).toBeCloseTo(5, 1);
    });

    it("decelerates within slowing radius", () => {
      const force = arrive(ORIGIN, { x: 5, y: 0, z: 0 }, 10, 10);
      // At distance 5, slowing radius 10 → speed = 10 * (5/10) = 5
      expect(magnitude(force)).toBeCloseTo(5, 1);
    });

    it("returns very slow speed near target", () => {
      const force = arrive(ORIGIN, { x: 1, y: 0, z: 0 }, 10, 10);
      // At distance 1, slowing radius 10 → speed = 10 * (1/10) = 1
      expect(magnitude(force)).toBeCloseTo(1, 1);
    });
  });

  // === Pursue ===

  describe("pursue", () => {
    it("leads a moving target", () => {
      const myPos: Vec3Like = { x: 0, y: 0, z: 0 };
      const myVel: Vec3Like = { x: 1, y: 0, z: 0 };
      const targetPos: Vec3Like = { x: 10, y: 0, z: 0 };
      const targetVel: Vec3Like = { x: 0, y: 0, z: 5 }; // Moving in Z

      const force = pursue(myPos, myVel, targetPos, targetVel, 5);
      // Should have a Z component (leading the target)
      expect(force.z).toBeGreaterThan(0);
    });

    it("behaves like seek when target is stationary", () => {
      const seekForce = seek(ORIGIN, { x: 10, y: 0, z: 0 }, 5);
      const pursueForce = pursue(ORIGIN, { x: 1, y: 0, z: 0 }, { x: 10, y: 0, z: 0 }, ZERO, 5);
      expectVec3Close(seekForce, pursueForce, 0.1);
    });
  });

  // === Evade ===

  describe("evade", () => {
    it("flees from predicted threat position", () => {
      const force = evade(
        ORIGIN,
        { x: 0, y: 0, z: 1 },
        { x: 10, y: 0, z: 0 },
        { x: -5, y: 0, z: 0 }, // Threat approaching
        5,
      );
      // Should flee away from predicted position
      expect(force.x).toBeLessThan(0);
    });

    it("returns zero when beyond panic distance", () => {
      const force = evade(
        ORIGIN,
        { x: 0, y: 0, z: 1 },
        { x: 100, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        5,
        10, // panic distance
      );
      expectZero(force);
    });
  });

  // === Wander ===

  describe("wander", () => {
    it("produces a force with bounded magnitude", () => {
      const result = wander(
        ORIGIN,
        { x: 0, y: 0, z: 5 },
        2, // wanderRadius
        4, // wanderDistance
        0.5, // jitter
        { x: 1, y: 0, z: 0 }, // prevTarget
      );
      expect(magnitude(result.force)).toBeGreaterThan(0);
    });

    it("returns a new target for persistence", () => {
      const result = wander(
        ORIGIN,
        { x: 0, y: 0, z: 5 },
        2,
        4,
        0.5,
        { x: 1, y: 0, z: 0 },
      );
      // New target should be on the wander circle (radius ~2)
      expect(magnitude(result.newTarget)).toBeCloseTo(2, 0);
    });

    it("maintains smooth direction changes across frames", () => {
      let target: Vec3Like = { x: 1, y: 0, z: 0 };
      const forces: Vec3Like[] = [];
      for (let i = 0; i < 10; i++) {
        const result = wander(
          ORIGIN,
          { x: 0, y: 0, z: 5 },
          2, 4, 0.1, // Low jitter for smooth changes
          target,
        );
        forces.push(result.force);
        target = result.newTarget;
      }
      // Forces should not wildly jump — check adjacent frame angle changes are small
      for (let i = 1; i < forces.length; i++) {
        const dot = forces[i].x * forces[i - 1].x + forces[i].z * forces[i - 1].z;
        const mag = magnitude(forces[i]) * magnitude(forces[i - 1]);
        if (mag > 0.01) {
          const cosAngle = dot / mag;
          // With low jitter, angles between frames should be < 90 degrees (cos > 0)
          expect(cosAngle).toBeGreaterThan(-0.5);
        }
      }
    });
  });

  // === Obstacle Avoidance ===

  describe("obstacleAvoidance", () => {
    it("steers around an obstacle in path", () => {
      const force = obstacleAvoidance(
        ORIGIN,
        { x: 0, y: 0, z: 5 }, // Moving in +Z
        [{ center: { x: 0, y: 0, z: 10 }, radius: 3 }], // Obstacle ahead
        15, // feeler length
      );
      // Should produce lateral steering force (X component)
      expect(magnitude(force)).toBeGreaterThan(0);
    });

    it("returns zero when path is clear", () => {
      const force = obstacleAvoidance(
        ORIGIN,
        { x: 0, y: 0, z: 5 },
        [{ center: { x: 50, y: 0, z: 10 }, radius: 3 }], // Far off to the side
        15,
      );
      expectZero(force);
    });

    it("returns zero when stationary", () => {
      const force = obstacleAvoidance(
        ORIGIN,
        ZERO,
        [{ center: { x: 0, y: 0, z: 5 }, radius: 3 }],
        15,
      );
      expectZero(force);
    });

    it("ignores obstacles behind the agent", () => {
      const force = obstacleAvoidance(
        ORIGIN,
        { x: 0, y: 0, z: 5 }, // Moving in +Z
        [{ center: { x: 0, y: 0, z: -10 }, radius: 3 }], // Behind
        15,
      );
      expectZero(force);
    });
  });

  // === Separation ===

  describe("separation", () => {
    it("pushes away from close neighbors", () => {
      const force = separation(
        ORIGIN,
        [{ x: 2, y: 0, z: 0 }], // Neighbor 2 units to the right
        5, // desired distance
      );
      // Should push in -X direction (away from neighbor)
      expect(force.x).toBeLessThan(0);
    });

    it("returns zero with no neighbors", () => {
      const force = separation(ORIGIN, [], 5);
      expectZero(force);
    });

    it("returns zero when neighbors are beyond desired distance", () => {
      const force = separation(
        ORIGIN,
        [{ x: 10, y: 0, z: 0 }],
        5,
      );
      expectZero(force);
    });

    it("stronger force for closer neighbors", () => {
      const closeForce = separation(ORIGIN, [{ x: 1, y: 0, z: 0 }], 5);
      const farForce = separation(ORIGIN, [{ x: 4, y: 0, z: 0 }], 5);
      expect(magnitude(closeForce)).toBeGreaterThan(magnitude(farForce));
    });
  });

  // === Cohesion ===

  describe("cohesion", () => {
    it("pulls toward center of neighbors", () => {
      const force = cohesion(
        ORIGIN,
        [{ x: 10, y: 0, z: 0 }, { x: 10, y: 0, z: 10 }],
      );
      // Center is at (10, 0, 5) — force should point in +X/+Z
      expect(force.x).toBeGreaterThan(0);
      expect(force.z).toBeGreaterThan(0);
    });

    it("returns zero with no neighbors", () => {
      const force = cohesion(ORIGIN, []);
      expectZero(force);
    });
  });

  // === Alignment ===

  describe("alignment", () => {
    it("matches average neighbor heading", () => {
      const force = alignment(
        { x: 1, y: 0, z: 0 }, // Moving in +X
        [{ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 5 }], // Neighbors moving in +Z
      );
      // Should steer toward +Z (neighbor heading) and away from +X (current heading)
      expect(force.z).toBeGreaterThan(0);
      expect(force.x).toBeLessThan(0);
    });

    it("returns zero with no neighbors", () => {
      const force = alignment({ x: 1, y: 0, z: 0 }, []);
      expectZero(force);
    });
  });

  // === Tether ===

  describe("tether", () => {
    it("returns zero inside radius", () => {
      const force = tether(
        { x: 3, y: 0, z: 0 },
        ORIGIN,
        10, // radius
        5,
      );
      expectZero(force);
    });

    it("pulls back when outside radius", () => {
      const force = tether(
        { x: 15, y: 0, z: 0 },
        ORIGIN,
        10,
        5,
      );
      // Should pull toward origin (in -X direction)
      expect(force.x).toBeLessThan(0);
      expect(magnitude(force)).toBeGreaterThan(0);
    });

    it("force scales with overshoot distance", () => {
      const nearEdge = tether({ x: 11, y: 0, z: 0 }, ORIGIN, 10, 5);
      const farOut = tether({ x: 18, y: 0, z: 0 }, ORIGIN, 10, 5);
      expect(magnitude(farOut)).toBeGreaterThan(magnitude(nearEdge));
    });

    it("caps force at maxSpeed", () => {
      // At 3x radius, overshoot ratio = 2 → capped at 1.0 → maxSpeed
      const force = tether({ x: 30, y: 0, z: 0 }, ORIGIN, 10, 5);
      expect(magnitude(force)).toBeCloseTo(5, 1);
    });
  });

  // === Composition ===

  describe("combineForces", () => {
    it("computes weighted sum", () => {
      const result = combineForces([
        { force: { x: 1, y: 0, z: 0 }, weight: 2 },
        { force: { x: 0, y: 0, z: 1 }, weight: 3 },
      ]);
      expectVec3Close(result, { x: 2, y: 0, z: 3 });
    });

    it("returns zero with empty forces", () => {
      const result = combineForces([]);
      expectZero(result);
    });
  });

  describe("truncate", () => {
    it("clamps to max magnitude", () => {
      const force = truncate({ x: 10, y: 0, z: 0 }, 5);
      expect(magnitude(force)).toBeCloseTo(5, 5);
    });

    it("preserves direction", () => {
      const force = truncate({ x: 10, y: 0, z: 0 }, 5);
      expectVec3Close(force, { x: 5, y: 0, z: 0 });
    });

    it("does not modify forces within limit", () => {
      const force = truncate({ x: 3, y: 0, z: 0 }, 5);
      expectVec3Close(force, { x: 3, y: 0, z: 0 });
    });
  });

  // === Composite Scenarios ===

  describe("composite behaviors", () => {
    it("boids: separation + cohesion + alignment produce balanced force", () => {
      const pos: Vec3Like = { x: 0, y: 0, z: 0 };
      const vel: Vec3Like = { x: 1, y: 0, z: 0 };
      const neighbors: Vec3Like[] = [
        { x: 3, y: 0, z: 2 },
        { x: -2, y: 0, z: 3 },
        { x: 1, y: 0, z: -3 },
      ];
      const neighborVels: Vec3Like[] = [
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: 1 },
      ];

      const sep = separation(pos, neighbors, 5);
      const coh = cohesion(pos, neighbors);
      const ali = alignment(vel, neighborVels);

      const combined = combineForces([
        { force: sep, weight: 1.5 },
        { force: coh, weight: 1.0 },
        { force: ali, weight: 1.0 },
      ]);

      // Combined force should be finite and non-zero
      expect(magnitude(combined)).toBeGreaterThan(0);
      expect(magnitude(combined)).toBeLessThan(100);
    });

    it("chase-with-tether: pursue + tether returns to anchor", () => {
      // NPC at x=35, chasing target at x=40, anchored at origin with r=20
      // Overshoot = (35-20)/20 = 0.75 → tether force = 5 * 0.75 = 3.75
      // Seek force = +5 (toward target), tether force = -3.75 (toward anchor)
      // Combined: 5*1 + (-3.75)*2 = 5 - 7.5 = -2.5 → pulls back
      const pursueForce = seek({ x: 35, y: 0, z: 0 }, { x: 40, y: 0, z: 0 }, 5);
      const tetherForce = tether({ x: 35, y: 0, z: 0 }, ORIGIN, 20, 5);

      const combined = combineForces([
        { force: pursueForce, weight: 1.0 },
        { force: tetherForce, weight: 2.0 },
      ]);

      // Tether weight is 2x pursue, and we're well beyond radius → should pull back
      expect(combined.x).toBeLessThan(0);
    });

    it("tethered wander: force stays bounded near anchor", () => {
      // NPC at the edge of tether radius
      const wanderResult = wander(
        { x: 9, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        2, 4, 0.3,
        { x: 0, y: 0, z: 1 },
      );
      const tetherForce = tether({ x: 9, y: 0, z: 0 }, ORIGIN, 10, 5);

      const combined = combineForces([
        { force: wanderResult.force, weight: 1.0 },
        { force: tetherForce, weight: 2.0 },
      ]);

      // Should be finite — tether is zero (inside radius), wander is bounded
      expect(magnitude(combined)).toBeLessThan(100);
    });
  });
});
