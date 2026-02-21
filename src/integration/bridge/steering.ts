/**
 * Steering Behaviors — Pure math library implementing Craig Reynolds'
 * autonomous agent movement algorithms.
 *
 * Every function is stateless: takes Vec3Like positions/velocities in,
 * returns Vec3Like force vectors out. No engine dependency, no side effects.
 *
 * The host (e.g., World's NPCManager) calls these per-frame to compute
 * steering forces, then applies them to NPC velocity/position.
 *
 * Reference: Craig Reynolds, "Steering Behaviors for Autonomous Characters" (1999)
 */

import type { Vec3Like } from "./engine-types.js";

// === Internal Helpers ===

/** Vec3 subtraction: a - b */
export function subtract(a: Vec3Like, b: Vec3Like): Vec3Like {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

/** Vec3 addition: a + b */
export function add(a: Vec3Like, b: Vec3Like): Vec3Like {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

/** Vec3 scalar multiply */
export function scale(v: Vec3Like, s: number): Vec3Like {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

/** Vec3 magnitude (length) */
export function magnitude(v: Vec3Like): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/** Vec3 distance between two points */
export function distance(a: Vec3Like, b: Vec3Like): number {
  return magnitude(subtract(a, b));
}

/** Normalize to unit vector. Returns zero vector if magnitude is ~0. */
export function normalize(v: Vec3Like): Vec3Like {
  const mag = magnitude(v);
  if (mag < 1e-8) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
}

/** Clamp vector magnitude to maxForce, preserving direction. */
export function truncate(force: Vec3Like, maxForce: number): Vec3Like {
  const mag = magnitude(force);
  if (mag <= maxForce) return force;
  return scale(normalize(force), maxForce);
}

/** Weighted sum of multiple force vectors. */
export function combineForces(forces: readonly { force: Vec3Like; weight: number }[]): Vec3Like {
  let x = 0, y = 0, z = 0;
  for (const { force, weight } of forces) {
    x += force.x * weight;
    y += force.y * weight;
    z += force.z * weight;
  }
  return { x, y, z };
}

// === Core Steering Behaviors ===

/**
 * Seek — full-speed toward target.
 * Returns desired velocity vector pointing at target with given maxSpeed.
 */
export function seek(position: Vec3Like, target: Vec3Like, maxSpeed: number): Vec3Like {
  const desired = subtract(target, position);
  return scale(normalize(desired), maxSpeed);
}

/**
 * Flee — move away from threat at full speed.
 * If panicDistance is set, returns zero when beyond that distance.
 */
export function flee(
  position: Vec3Like,
  threat: Vec3Like,
  maxSpeed: number,
  panicDistance?: number,
): Vec3Like {
  const offset = subtract(position, threat);
  if (panicDistance !== undefined && magnitude(offset) > panicDistance) {
    return { x: 0, y: 0, z: 0 };
  }
  return scale(normalize(offset), maxSpeed);
}

/**
 * Arrive — seek with deceleration. Slows down within slowingRadius,
 * stops at target. Outside the radius, behaves like seek.
 */
export function arrive(
  position: Vec3Like,
  target: Vec3Like,
  maxSpeed: number,
  slowingRadius: number,
): Vec3Like {
  const toTarget = subtract(target, position);
  const dist = magnitude(toTarget);
  if (dist < 1e-8) return { x: 0, y: 0, z: 0 };
  const speed = dist < slowingRadius
    ? maxSpeed * (dist / slowingRadius)
    : maxSpeed;
  return scale(normalize(toTarget), speed);
}

/**
 * Pursue — intercept a moving target by predicting its future position.
 * Look-ahead time scales with distance-to-target / combined speed.
 */
export function pursue(
  position: Vec3Like,
  velocity: Vec3Like,
  targetPosition: Vec3Like,
  targetVelocity: Vec3Like,
  maxSpeed: number,
): Vec3Like {
  const toTarget = subtract(targetPosition, position);
  const dist = magnitude(toTarget);
  const combinedSpeed = magnitude(velocity) + magnitude(targetVelocity);
  const lookAhead = combinedSpeed < 1e-8 ? 0 : dist / combinedSpeed;
  const predictedPos = add(targetPosition, scale(targetVelocity, lookAhead));
  return seek(position, predictedPos, maxSpeed);
}

/**
 * Evade — flee from a moving threat's predicted future position.
 * If panicDistance is set, returns zero when currently beyond that distance.
 */
export function evade(
  position: Vec3Like,
  velocity: Vec3Like,
  threatPosition: Vec3Like,
  threatVelocity: Vec3Like,
  maxSpeed: number,
  panicDistance?: number,
): Vec3Like {
  if (panicDistance !== undefined && distance(position, threatPosition) > panicDistance) {
    return { x: 0, y: 0, z: 0 };
  }
  const toThreat = subtract(threatPosition, position);
  const dist = magnitude(toThreat);
  const combinedSpeed = magnitude(velocity) + magnitude(threatVelocity);
  const lookAhead = combinedSpeed < 1e-8 ? 0 : dist / combinedSpeed;
  const predictedPos = add(threatPosition, scale(threatVelocity, lookAhead));
  return flee(position, predictedPos, maxSpeed);
}

/**
 * Wander — smooth random movement using circle-and-jitter method.
 *
 * Projects a circle of `wanderRadius` at `wanderDistance` ahead of the agent,
 * then jitters a target point on that circle. Returns the steering force and
 * the new wander target (caller must persist for next frame).
 *
 * @param wanderRadius  Radius of the projected wander circle
 * @param wanderDistance Distance ahead to project the circle center
 * @param jitter        Max displacement per frame on the circle
 * @param prevTarget    Previous wander target on the circle (or {x:0,y:0,z:1} initially)
 */
export function wander(
  position: Vec3Like,
  velocity: Vec3Like,
  wanderRadius: number,
  wanderDistance: number,
  jitter: number,
  prevTarget: Vec3Like,
): { force: Vec3Like; newTarget: Vec3Like } {
  // Jitter the previous target point
  const jittered: Vec3Like = {
    x: prevTarget.x + (Math.random() * 2 - 1) * jitter,
    y: prevTarget.y,  // Keep Y stable for ground-based agents
    z: prevTarget.z + (Math.random() * 2 - 1) * jitter,
  };

  // Project back onto the wander circle
  const newTarget = scale(normalize(jittered), wanderRadius);

  // Get the heading direction (default forward if stationary)
  const heading = magnitude(velocity) > 1e-8
    ? normalize(velocity)
    : { x: 0, y: 0, z: 1 };

  // Circle center is wanderDistance ahead along heading
  const circleCenter = add(position, scale(heading, wanderDistance));
  const worldTarget = add(circleCenter, newTarget);
  const force = subtract(worldTarget, position);

  return { force, newTarget };
}

/**
 * Obstacle Avoidance — cast a feeler ray ahead and steer around obstacles.
 * Returns a lateral force to avoid the nearest obstacle in path.
 *
 * @param obstacles Array of { center, radius } spherical obstacles
 * @param feelerLength How far ahead to look
 */
export function obstacleAvoidance(
  position: Vec3Like,
  velocity: Vec3Like,
  obstacles: readonly { center: Vec3Like; radius: number }[],
  feelerLength: number,
): Vec3Like {
  const speed = magnitude(velocity);
  if (speed < 1e-8) return { x: 0, y: 0, z: 0 };

  const heading = normalize(velocity);
  const feelerEnd = add(position, scale(heading, feelerLength));

  let nearestDist = Infinity;
  let nearestObstacle: { center: Vec3Like; radius: number } | null = null;

  for (const obs of obstacles) {
    // Simple sphere-line intersection: project obstacle center onto feeler
    const toObs = subtract(obs.center, position);
    const projection = toObs.x * heading.x + toObs.y * heading.y + toObs.z * heading.z;

    // Behind or beyond feeler?
    if (projection < 0 || projection > feelerLength) continue;

    // Closest point on feeler to obstacle center
    const closestPoint = add(position, scale(heading, projection));
    const lateralDist = distance(closestPoint, obs.center);

    if (lateralDist < obs.radius && projection < nearestDist) {
      nearestDist = projection;
      nearestObstacle = obs;
    }
  }

  if (!nearestObstacle) return { x: 0, y: 0, z: 0 };

  // Steer away from obstacle — lateral force perpendicular to heading
  const toObs = subtract(nearestObstacle.center, position);
  const projection = toObs.x * heading.x + toObs.y * heading.y + toObs.z * heading.z;
  const closestPoint = add(position, scale(heading, projection));
  let avoidDir = subtract(closestPoint, nearestObstacle.center);

  // If feeler goes through obstacle center, pick an arbitrary perpendicular
  if (magnitude(avoidDir) < 1e-8) {
    // Cross product with up vector to get a lateral direction
    avoidDir = { x: -heading.z, y: 0, z: heading.x };
    if (magnitude(avoidDir) < 1e-8) {
      avoidDir = { x: 1, y: 0, z: 0 };
    }
  }
  avoidDir = normalize(avoidDir);

  // Stronger force when closer
  const urgency = 1.0 + (feelerLength - nearestDist) / feelerLength;
  return scale(avoidDir, speed * urgency);
}

// === Flocking Behaviors (Boids) ===

/**
 * Separation — push away from neighbors that are too close.
 * Force inversely proportional to distance.
 */
export function separation(
  position: Vec3Like,
  neighbors: readonly Vec3Like[],
  desiredDistance: number,
): Vec3Like {
  let x = 0, y = 0, z = 0;
  let count = 0;

  for (const neighbor of neighbors) {
    const offset = subtract(position, neighbor);
    const dist = magnitude(offset);
    if (dist > 0 && dist < desiredDistance) {
      // Weight by inverse distance — closer neighbors push harder
      const push = normalize(offset);
      const weight = 1.0 - (dist / desiredDistance);
      x += push.x * weight;
      y += push.y * weight;
      z += push.z * weight;
      count++;
    }
  }

  if (count === 0) return { x: 0, y: 0, z: 0 };
  return { x: x / count, y: y / count, z: z / count };
}

/**
 * Cohesion — steer toward the center of mass of neighbors.
 */
export function cohesion(
  position: Vec3Like,
  neighbors: readonly Vec3Like[],
): Vec3Like {
  if (neighbors.length === 0) return { x: 0, y: 0, z: 0 };

  let cx = 0, cy = 0, cz = 0;
  for (const n of neighbors) {
    cx += n.x;
    cy += n.y;
    cz += n.z;
  }
  const center: Vec3Like = {
    x: cx / neighbors.length,
    y: cy / neighbors.length,
    z: cz / neighbors.length,
  };

  return normalize(subtract(center, position));
}

/**
 * Alignment — match the average heading of neighbors.
 */
export function alignment(
  velocity: Vec3Like,
  neighborVelocities: readonly Vec3Like[],
): Vec3Like {
  if (neighborVelocities.length === 0) return { x: 0, y: 0, z: 0 };

  let ax = 0, ay = 0, az = 0;
  for (const v of neighborVelocities) {
    ax += v.x;
    ay += v.y;
    az += v.z;
  }
  const avgHeading: Vec3Like = {
    x: ax / neighborVelocities.length,
    y: ay / neighborVelocities.length,
    z: az / neighborVelocities.length,
  };

  return subtract(normalize(avgHeading), normalize(velocity));
}

// === Constraint Behaviors ===

/**
 * Tether — soft constraint that pulls NPC back toward an anchor point
 * when it drifts beyond the specified radius. Returns zero force inside
 * the radius; force scales with overshoot distance outside.
 */
export function tether(
  position: Vec3Like,
  anchor: Vec3Like,
  radius: number,
  maxSpeed: number,
): Vec3Like {
  const offset = subtract(position, anchor);
  const dist = magnitude(offset);
  if (dist <= radius) return { x: 0, y: 0, z: 0 };

  // Overshoot ratio: how far beyond the radius (0 = at edge, 1 = at 2x radius)
  const overshoot = (dist - radius) / radius;
  const strength = Math.min(overshoot, 1.0);
  return scale(normalize(subtract(anchor, position)), maxSpeed * strength);
}
