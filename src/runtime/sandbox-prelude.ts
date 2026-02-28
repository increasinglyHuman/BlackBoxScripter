/**
 * Sandbox Prelude — Runtime types provided as compartment endowments.
 *
 * The transpiled code imports WorldScript, Vector3, Quaternion from "poqpoq/types".
 * Those imports get stripped by transformForSandbox (the sandbox can't do ESM imports).
 * This module provides the actual classes as compartment globals so the script
 * code can reference them after import stripping.
 *
 * WorldScript is a sandbox-compatible version of the real one (src/types/world-script.ts).
 * The real one is abstract and has heavy import dependencies. Properties (world, object,
 * container, owner) are injected by worker-entry.ts via Object.defineProperty after
 * instantiation, so convenience methods can delegate to this.world / this.object.
 *
 * Vector3 and Quaternion are re-exported from src/types/math.ts with `fromString`
 * aliases added (the codegen emits `Vector3.fromString()` for type casts).
 */

import { Vector3, Quaternion } from "../types/math.js";

// === Add fromString aliases ===
// Codegen emits `Vector3.fromString(s)` for (vector) type casts,
// but the class has `fromLSL`. Add the alias.
(Vector3 as any).fromString = Vector3.fromLSL;
(Quaternion as any).fromString = Quaternion.fromLSL;

// === WorldScript (sandbox-compatible) ===
//
// Convenience methods mirror the real WorldScript. They delegate to the
// injected API proxies (this.world, this.object, this.container) which
// forward calls to the main thread via postMessage.

class WorldScript {
  // These are injected by worker-entry.ts after instantiation:
  declare world: Record<string, (...args: unknown[]) => unknown>;
  declare object: Record<string, (...args: unknown[]) => unknown>;
  declare container: Record<string, (...args: unknown[]) => unknown>;
  declare owner: { id: string; name: string; username: string };
  declare scriptId: string;

  /** State definitions — overridden by subclass */
  states: Record<string, Record<string, (...args: unknown[]) => unknown>> = {};

  /** Current state name */
  _currentState = "default";

  get currentState(): string {
    return this._currentState;
  }

  // === State Machine ===

  async transitionTo(newState: string): Promise<void> {
    if (newState === this._currentState) return;
    const oldState = this._currentState;
    const exitHandler = this.states[oldState]?.onStateExit;
    if (exitHandler) await exitHandler.call(this, oldState);
    this._currentState = newState;
    const entryHandler = this.states[newState]?.onStateEntry;
    if (entryHandler) await entryHandler.call(this, newState);
  }

  // === Communication (llSay, llWhisper, llShout, etc.) ===

  say(channel: number, message: string): void {
    this.world.say(channel, message);
  }

  whisper(channel: number, message: string): void {
    this.world.whisper(channel, message);
  }

  shout(channel: number, message: string): void {
    this.world.shout(channel, message);
  }

  ownerSay(message: string): void {
    this.world.ownerSay(message);
  }

  listen(channel: number, name?: string, id?: string, message?: string): unknown {
    return this.world.listen(channel, name, id, message);
  }

  listenRemove(handle: unknown): void {
    this.world.listenRemove(handle);
  }

  sendLinkMessage(link: number, num: number, str: string, id: string): void {
    this.container.sendLinkMessage(link, num, str, id);
  }

  // === Timers ===

  setTimer(interval: number, id?: string): unknown {
    return this.world.setTimer(interval, id);
  }

  clearTimer(id?: string): void {
    this.world.clearTimer(id);
  }

  delay(seconds: number): Promise<void> {
    return new Promise(resolve => {
      this.world.setTimeout(resolve, seconds * 1000);
    });
  }

  // === Permissions ===

  requestPermissions(...args: unknown[]): void {
    this.world.requestPermissions(...args);
  }

  getPermissions(): unknown {
    return this.world.getPermissions();
  }

  startAnimation(name: string): void {
    this.world.startAnimation(name);
  }

  stopAnimation(name: string): void {
    this.world.stopAnimation(name);
  }

  // === Perception ===

  sensor(name: string, id: string, type: number, range: number, arc: number): void {
    this.world.sensor(name, id, type, range, arc);
  }

  sensorRepeat(name: string, id: string, type: number, range: number, arc: number, rate: number): void {
    this.world.sensorRepeat(name, id, type, range, arc, rate);
  }

  sensorRemove(): void {
    this.world.sensorRemove();
  }

  // === Lifecycle ===

  die(): void {
    this.world.die();
  }

  reset(): void {
    this.world.resetScript();
  }

  // === Utility ===

  random(): number {
    return Math.random();
  }

  getTime(): unknown {
    return this.world.getTime();
  }

  log(...args: unknown[]): void {
    this.world.log(...args);
  }
}

export { Vector3, Quaternion, WorldScript };
