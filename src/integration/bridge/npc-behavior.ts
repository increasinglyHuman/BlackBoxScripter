/**
 * NPC Behavior — Finite state machines for common NPC behavior patterns.
 *
 * Each "runner" composes steering behaviors + animations into a
 * higher-level behavioral pattern (patrol, wander, follow, guard).
 *
 * Runners expose `update(dt)` which the host calls per frame. They return
 * ScriptCommand objects (or null) representing the next action.
 *
 * Pure logic — no engine dependency. Uses Vec3Like from engine-types.
 */

import type { Vec3Like } from "./engine-types.js";
import type { ScriptCommand, Vec3, SteeringBehaviorConfig } from "../protocol/script-command.js";
import * as steering from "./steering.js";

// === Behavior State ===

export type BehaviorState = "idle" | "patrol" | "wander" | "follow" | "guard";

// === Patrol Waypoint (extended with timing) ===

export interface BehaviorWaypoint {
  readonly position: Vec3Like;
  readonly lookAt?: Vec3Like;
  readonly pauseDuration?: number;
  readonly animation?: string;
  readonly say?: string;
}

// === Patrol Runner ===

/**
 * Visits waypoints in sequence. At each waypoint, optionally pauses,
 * plays an animation, says a message, and looks at a target.
 */
export class PatrolRunner {
  readonly npcId: string;
  private waypoints: readonly BehaviorWaypoint[];
  private loop: boolean;
  private currentIndex = 0;
  private pauseRemaining = 0;
  private moving = false;
  private finished = false;

  constructor(npcId: string, waypoints: readonly BehaviorWaypoint[], loop = true) {
    this.npcId = npcId;
    this.waypoints = waypoints;
    this.loop = loop;
  }

  /** Current waypoint index */
  get waypointIndex(): number { return this.currentIndex; }

  /** Whether the patrol has finished (only when loop=false) */
  get isFinished(): boolean { return this.finished; }

  /**
   * Update the patrol. Returns a list of commands to execute this frame.
   * @param dt Delta time in seconds
   * @param npcPosition Current NPC position (from host)
   */
  update(dt: number, npcPosition: Vec3Like): ScriptCommand[] {
    if (this.finished || this.waypoints.length === 0) return [];

    const commands: ScriptCommand[] = [];
    const wp = this.waypoints[this.currentIndex];

    // Pausing at waypoint?
    if (this.pauseRemaining > 0) {
      this.pauseRemaining -= dt;
      if (this.pauseRemaining <= 0) {
        this.pauseRemaining = 0;
        this.advanceWaypoint(commands);
      }
      return commands;
    }

    // Arrived at waypoint?
    const dist = steering.distance(npcPosition, wp.position);
    if (!this.moving) {
      // Start moving to waypoint
      this.moving = true;
      commands.push({
        type: "npcMoveTo",
        npcId: this.npcId,
        position: wp.position as Vec3,
      });
      return commands;
    }

    if (dist < 1.0) {
      this.moving = false;

      // Execute waypoint actions
      if (wp.lookAt) {
        commands.push({ type: "npcLookAt", npcId: this.npcId, position: wp.lookAt as Vec3 });
      }
      if (wp.animation) {
        commands.push({ type: "npcPlayAnimation", npcId: this.npcId, animation: wp.animation });
      }
      if (wp.say) {
        commands.push({ type: "npcSay", npcId: this.npcId, message: wp.say, channel: 0 });
      }

      if (wp.pauseDuration && wp.pauseDuration > 0) {
        this.pauseRemaining = wp.pauseDuration;
      } else {
        this.advanceWaypoint(commands);
      }
    }

    return commands;
  }

  private advanceWaypoint(commands: ScriptCommand[]): void {
    this.currentIndex++;
    if (this.currentIndex >= this.waypoints.length) {
      if (this.loop) {
        this.currentIndex = 0;
      } else {
        this.finished = true;
        return;
      }
    }
    // Start moving to next waypoint
    this.moving = true;
    const nextWp = this.waypoints[this.currentIndex];
    commands.push({
      type: "npcMoveTo",
      npcId: this.npcId,
      position: nextWp.position as Vec3,
    });
  }
}

// === Wander Runner ===

/**
 * Smooth random movement within a radius using Reynolds wander + tether.
 * Periodically pauses for idle animations.
 */
export class WanderRunner {
  readonly npcId: string;
  private center: Vec3Like;
  private radius: number;
  private maxSpeed: number;
  private wanderTarget: Vec3Like = { x: 0, y: 0, z: 1 };
  private moveTimer = 0;
  private moveInterval: number;

  constructor(
    npcId: string,
    center: Vec3Like,
    radius: number,
    maxSpeed = 1.5,
    moveInterval = 2.0,
  ) {
    this.npcId = npcId;
    this.center = center;
    this.radius = radius;
    this.maxSpeed = maxSpeed;
    this.moveInterval = moveInterval;
  }

  /**
   * Compute the next wander position and return a move command.
   * @param dt Delta time in seconds
   * @param npcPosition Current NPC position
   * @param npcVelocity Current NPC velocity (or estimated)
   */
  update(dt: number, npcPosition: Vec3Like, npcVelocity: Vec3Like = { x: 0, y: 0, z: 0 }): ScriptCommand[] {
    this.moveTimer -= dt;
    if (this.moveTimer > 0) return [];

    this.moveTimer = this.moveInterval;

    // Compute wander force
    const wanderResult = steering.wander(
      npcPosition, npcVelocity,
      2.0, 4.0, 0.5,
      this.wanderTarget,
    );
    this.wanderTarget = wanderResult.newTarget;

    // Apply tether to keep within radius
    const tetherForce = steering.tether(npcPosition, this.center, this.radius, this.maxSpeed);

    const combined = steering.combineForces([
      { force: wanderResult.force, weight: 1.0 },
      { force: tetherForce, weight: 2.0 },
    ]);

    const direction = steering.truncate(steering.normalize(combined), 1.0);
    const targetPos: Vec3Like = {
      x: npcPosition.x + direction.x * this.radius * 0.3,
      y: npcPosition.y,
      z: npcPosition.z + direction.z * this.radius * 0.3,
    };

    // Clamp to tether radius
    const distFromCenter = steering.distance(targetPos, this.center);
    let finalPos = targetPos;
    if (distFromCenter > this.radius) {
      const dir = steering.normalize(steering.subtract(targetPos, this.center));
      finalPos = steering.add(this.center, steering.scale(dir, this.radius * 0.9));
    }

    return [{
      type: "npcMoveTo",
      npcId: this.npcId,
      position: finalPos as Vec3,
    }];
  }
}

// === Follow Runner ===

/**
 * Follows a target, maintaining a specified distance.
 * Uses 'arrive' steering (decelerates near target).
 */
export class FollowRunner {
  readonly npcId: string;
  private targetId: string;
  private followDistance: number;
  private maxSpeed: number;

  constructor(npcId: string, targetId: string, followDistance = 2.0, maxSpeed = 3.0) {
    this.npcId = npcId;
    this.targetId = targetId;
    this.followDistance = followDistance;
    this.maxSpeed = maxSpeed;
  }

  /** The entity being followed */
  get target(): string { return this.targetId; }

  /**
   * Compute follow movement.
   * @param npcPosition Current NPC position
   * @param targetPosition Current target position (host must supply)
   */
  update(npcPosition: Vec3Like, targetPosition: Vec3Like): ScriptCommand[] {
    const dist = steering.distance(npcPosition, targetPosition);

    // Close enough — stay put
    if (dist <= this.followDistance) {
      return [];
    }

    // Use arrive behavior (decelerates at stopDistance)
    const force = steering.arrive(npcPosition, targetPosition, this.maxSpeed, this.followDistance * 2);
    const direction = steering.normalize(force);
    const step = Math.min(dist - this.followDistance, this.maxSpeed);
    const moveTarget: Vec3Like = {
      x: npcPosition.x + direction.x * step,
      y: npcPosition.y,
      z: npcPosition.z + direction.z * step,
    };

    return [{
      type: "npcMoveTo",
      npcId: this.npcId,
      position: moveTarget as Vec3,
    }];
  }
}

// === Guard Runner ===

/**
 * Two-state FSM: IDLE (tethered wander) ↔ ALERT (pursue with tether).
 *
 * - IDLE: Wanders around anchor within idleRadius
 * - ALERT: Pursues target within leashRadius; returns to IDLE when target
 *   escapes beyond leashRadius
 */
export class GuardRunner {
  readonly npcId: string;
  private anchor: Vec3Like;
  private idleRadius: number;
  private aggroRange: number;
  private leashRadius: number;
  private state: "idle" | "alert" = "idle";
  private wanderRunner: WanderRunner;

  constructor(
    npcId: string,
    anchor: Vec3Like,
    options: {
      idleRadius?: number;
      aggroRange?: number;
      leashRadius?: number;
      maxSpeed?: number;
    } = {},
  ) {
    this.npcId = npcId;
    this.anchor = anchor;
    this.idleRadius = options.idleRadius ?? 8;
    this.aggroRange = options.aggroRange ?? 15;
    this.leashRadius = options.leashRadius ?? 30;
    this.wanderRunner = new WanderRunner(
      npcId, anchor, this.idleRadius, options.maxSpeed ?? 1.5,
    );
  }

  /** Current behavior state */
  get currentState(): "idle" | "alert" { return this.state; }

  /**
   * Update the guard.
   * @param dt Delta time in seconds
   * @param npcPosition Current NPC position
   * @param targetPosition Position of the thing to guard against (or null)
   * @param npcVelocity Current NPC velocity
   */
  update(
    dt: number,
    npcPosition: Vec3Like,
    targetPosition: Vec3Like | null,
    npcVelocity: Vec3Like = { x: 0, y: 0, z: 0 },
  ): ScriptCommand[] {
    if (this.state === "idle") {
      // Check for aggro trigger
      if (targetPosition) {
        const distToTarget = steering.distance(npcPosition, targetPosition);
        if (distToTarget <= this.aggroRange) {
          this.state = "alert";
          return this.pursueTarget(npcPosition, targetPosition);
        }
      }
      // Continue idle wandering
      return this.wanderRunner.update(dt, npcPosition, npcVelocity);
    }

    // ALERT state
    if (!targetPosition) {
      // Target gone — return to idle
      this.state = "idle";
      return this.returnToAnchor(npcPosition);
    }

    const distToTarget = steering.distance(npcPosition, targetPosition);
    const distFromAnchor = steering.distance(npcPosition, this.anchor);

    // Target escaped beyond leash?
    if (distToTarget > this.leashRadius || distFromAnchor > this.leashRadius) {
      this.state = "idle";
      return this.returnToAnchor(npcPosition);
    }

    return this.pursueTarget(npcPosition, targetPosition);
  }

  private pursueTarget(npcPosition: Vec3Like, targetPosition: Vec3Like): ScriptCommand[] {
    const force = steering.seek(npcPosition, targetPosition, 3.0);
    const tetherForce = steering.tether(npcPosition, this.anchor, this.leashRadius, 3.0);

    const combined = steering.combineForces([
      { force, weight: 1.0 },
      { force: tetherForce, weight: 1.5 },
    ]);

    const direction = steering.normalize(combined);
    const moveTarget: Vec3Like = {
      x: npcPosition.x + direction.x * 2,
      y: npcPosition.y,
      z: npcPosition.z + direction.z * 2,
    };

    return [{
      type: "npcMoveTo",
      npcId: this.npcId,
      position: moveTarget as Vec3,
    }];
  }

  private returnToAnchor(npcPosition: Vec3Like): ScriptCommand[] {
    if (steering.distance(npcPosition, this.anchor) < 2.0) return [];
    return [{
      type: "npcMoveTo",
      npcId: this.npcId,
      position: this.anchor as Vec3,
    }];
  }
}

// === Steering Config Builder ===

/**
 * Helper to build SteeringBehaviorConfig arrays for common patterns.
 */
export const SteeringPresets = {
  /** Tethered wander — stay near anchor, move randomly */
  tetheredWander(anchor: Vec3Like, radius: number, wanderWeight = 1.0, tetherWeight = 2.0): SteeringBehaviorConfig[] {
    return [
      { behavior: "wander", weight: wanderWeight, radius: 2, distance: 4, jitter: 0.3 },
      { behavior: "tether", weight: tetherWeight, anchor: anchor as Vec3, radius },
    ];
  },

  /** Boids flocking — separation + cohesion + alignment + optional wander */
  boids(separationDist = 2, cohesionDist = 10, alignDist = 8): SteeringBehaviorConfig[] {
    return [
      { behavior: "separation", weight: 1.5, distance: separationDist },
      { behavior: "cohesion", weight: 1.0, distance: cohesionDist },
      { behavior: "alignment", weight: 1.0, distance: alignDist },
      { behavior: "wander", weight: 0.3, jitter: 0.2 },
    ];
  },

  /** Chase with leash — pursue target but respect tether */
  chaseWithLeash(targetId: string, anchor: Vec3Like, leashRadius: number): SteeringBehaviorConfig[] {
    return [
      { behavior: "pursue", weight: 1.0, targetId },
      { behavior: "tether", weight: 2.0, anchor: anchor as Vec3, radius: leashRadius },
    ];
  },
} as const;
