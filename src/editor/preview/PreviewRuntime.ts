/**
 * PreviewRuntime — Wires ScriptHostAdapter + PreviewRelay + event dispatch.
 *
 * Lifecycle:
 * 1. start() — creates adapter, connects relay as command handler
 * 2. run(code, scriptName) — loads transpiled code into SES sandbox
 * 3. stop() — tears down current script
 * 4. dispose() — full cleanup (adapter + workers)
 *
 * @see ADR-005 (Glitch Preview Integration)
 */

import { ScriptHostAdapter } from "../../integration/host/script-host-adapter.js";
import type { PreviewPanel } from "./PreviewPanel.js";
import type { PreviewConsole } from "./PreviewConsole.js";
import type { ScriptEventEnvelope, ScriptEvent } from "../../integration/protocol/script-event.js";

export class PreviewRuntime {
  private adapter: ScriptHostAdapter | null = null;
  private panel: PreviewPanel;
  private console: PreviewConsole;
  private currentScriptId: string | null = null;
  private currentContainerId: string | null = null;
  private running = false;

  constructor(panel: PreviewPanel) {
    this.panel = panel;
    this.console = panel.getConsole();
  }

  /**
   * Initialize the runtime adapter. Call once when preview opens.
   */
  start(): void {
    const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env.BASE_URL ?? "/scripter/";
    const workerUrl = base + "runtime/worker-bundle.js";

    this.adapter = new ScriptHostAdapter({
      workerUrl,
      pool: { poolSize: 1, maxScriptsPerWorker: 10 },
    });

    // Wire: adapter commands → PreviewRelay → Glitch iframe
    const relay = this.panel.getRelay();
    if (relay) {
      this.adapter.onScriptCommand(relay.handle);
    }

    // Wire: adapter logs → preview console
    this.adapter.onLog((_scriptId, level, args) => {
      this.console.system(`[${level}] ${args.map(String).join(" ")}`);
    });

    // Wire: adapter errors → preview console
    this.adapter.onError((_scriptId, error, stack) => {
      this.console.system(`Error: ${error}`);
      if (stack) this.console.system(stack);
    });

    this.adapter.start();
    this.running = true;
  }

  /**
   * Run transpiled code in the sandbox.
   * Stops any previously running script first.
   */
  async run(code: string, scriptName: string): Promise<void> {
    if (!this.adapter || !this.running) {
      this.console.system("Runtime not started");
      return;
    }

    // Stop previous script
    this.stopScript();

    // Wait for Glitch to be ready
    await this.panel.waitForReady();

    // Generate a synthetic container ID for the preview prim
    const containerId = `preview_${crypto.randomUUID().slice(0, 8)}`;
    this.currentContainerId = containerId;

    // Reset Glitch scene
    const relay = this.panel.getRelay();
    relay?.sendReset();

    // Create root prim in Glitch
    relay?.sendCreatePrim({
      objectId: containerId,
      primType: 0, // BOX
      position: { x: 0, y: 0.5, z: 2 },
      name: scriptName,
    });

    // Load the script into the sandbox
    const scriptId = this.adapter.loadScript(code, containerId, { name: scriptName });
    if (!scriptId) {
      this.console.system("Failed to load script into sandbox");
      return;
    }

    this.currentScriptId = scriptId;

    // Inform Glitch about the loaded script
    relay?.sendLoad(scriptId, containerId);

    this.console.system(`Running: ${scriptName}`);
  }

  /**
   * Dispatch a Glitch event to the running script.
   * Called from PreviewPanel's onEvent callback.
   */
  dispatchEvent(envelope: { objectId: string; event: { type: string; [key: string]: unknown } }): void {
    if (!this.adapter || !this.currentContainerId) return;

    const mapped = this.mapGlitchEvent(envelope.event);
    if (!mapped) return;

    const scriptEnvelope: ScriptEventEnvelope = {
      targetObjectId: this.currentContainerId,
      event: mapped,
    };

    this.adapter.dispatchWorldEvent(scriptEnvelope);
  }

  /**
   * Stop the currently running script (but keep adapter alive).
   */
  stopScript(): void {
    if (this.currentContainerId && this.adapter) {
      this.adapter.removeObject(this.currentContainerId);
      this.currentScriptId = null;
      this.currentContainerId = null;
    }
  }

  /**
   * Full shutdown — stop adapter, clean up.
   */
  dispose(): void {
    this.stopScript();
    if (this.adapter) {
      this.adapter.stop();
      this.adapter = null;
    }
    this.running = false;
  }

  isRunning(): boolean {
    return this.running && this.currentScriptId !== null;
  }

  /**
   * Map a Glitch touch event to the ScriptEvent union type.
   */
  private mapGlitchEvent(raw: { type: string; [key: string]: unknown }): ScriptEvent | null {
    const agent = {
      id: (raw.agentId as string) ?? "preview-user",
      name: (raw.agentName as string) ?? "Preview User",
    };

    switch (raw.type) {
      case "touchStart":
        return { type: "touchStart", agent, face: 0 };
      case "touch":
        return { type: "touch", agent, face: 0 };
      case "touchEnd":
        return { type: "touchEnd", agent, face: 0 };
      default:
        return null;
    }
  }
}
